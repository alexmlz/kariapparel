import { Product } from 'shared/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'shared/services/product.service';
import { Component } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  categories$;
  id;
  product: Product = {key: '', title: '', description: '', price: null, category: '', imageUrl: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {

    this.categories$ = categoryService.getAll().snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
      })
    );

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id).valueChanges()
      .pipe(take(1)).subscribe((product: Product) => this.product = product);
    }
  }

  save(product) {
    if (this.id) {
      this.productService.update(this.id, product);
    } else { this.productService.create(product); }

    this.router.navigate(['/admin/products']);
  }

  delete() {
    // tslint:disable-next-line: curly
    if (!confirm('Are you sure you want to delete this product')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);

  }

}
