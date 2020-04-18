import { ProductService } from './../../product.service';
import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { SortEvent, compare } from 'src/app/models/sort';
import { SortableDirective } from 'src/app/sortable.directive';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  products: Product[];
  filteredProducts: any[];
  subscription: Subscription;
  items: Product[] = [];
  itemCount: number;
  page = 1;
  pageSize = 4;
  collectionSize;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll().snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Product }))
        )
      ).subscribe(products => {
        this.filteredProducts = this.products = products;
        this.collectionSize = this.filteredProducts.length;
      });
  }

  filter(query: string) {
    this.filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '') {
      this.filteredProducts = this.filteredProducts;
    } else {
      this.filteredProducts = this.filteredProducts.sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

}
