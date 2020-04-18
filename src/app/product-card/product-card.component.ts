
import { Component, Input } from '@angular/core';
import { Product } from '../models/product';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('product') product: Product;
  @Input('show-actions') showActions = true;
  constructor() { }

}
