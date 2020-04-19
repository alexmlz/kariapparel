import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from 'src/app/models/product';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  products: Product[] = [];
  filteredProducts: Product[]  = [];
  cart$: Observable<ShoppingCart>;
  category: string;
  cart: any;
  subscription1: Subscription;

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private cartService: ShoppingCartService
    ) {
    this.subscription = productService.getAll().snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Product }))
      )
    ).subscribe(products => {
      this.products = products;

      route.queryParamMap.subscribe(params => {
        this.category = params.get('category');
        this.filteredProducts = (this.category) ?
          this.products.filter(p => p.category === this.category) :
          this.products;
      });
    });
  }

  async ngOnInit() {
   //this.cart$ = await this.cartService.getCartPromise();
      this.subscription1 = (await this.cartService.getCart()).valueChanges()
      .pipe().subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }


}
