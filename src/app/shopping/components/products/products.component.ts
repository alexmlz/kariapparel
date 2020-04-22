import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Product } from 'app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[]  = [];
  cart$: Observable<ShoppingCart>;
  category: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService
    ) {
  }

  async ngOnInit() {
   this.cart$ = await this.cartService.getCartPromise();
   this.populateProducts();
  }

  private populateProducts() {
    this.productService.getAll().snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Product }))
      )
    ).subscribe(products => {
      this.products = products;

      this.route.queryParamMap.subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
    });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) :
    this.products;
  }
}
