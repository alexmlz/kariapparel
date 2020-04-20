import { ShoppingCartItem } from './models/shopping-cart-item';
import { take, map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCartPromise(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges().pipe(
      map( (x: any ) => {
        if (x) {
          return new ShoppingCart(x.items);
        }
      })
    );
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string): AngularFireObject<ShoppingCartItem> {
   return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');
    // tslint:disable-next-line: curly
    if (cartId) return cartId;
    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key);
    item$.valueChanges()
    .pipe(take(1)).subscribe(item => {
      // tslint:disable-next-line: curly
      if (item) {
        const quantity = (item.quantity || 0) + change;
        // tslint:disable-next-line: curly
        if (quantity === 0) item$.remove();
        // tslint:disable-next-line: curly
        else item$.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          description: product.description,
          // tslint:disable-next-line: object-literal-shorthand
          quantity: quantity
        });
      } else {
          item$.update({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          description: product.description,
          // tslint:disable-next-line: object-literal-shorthand
          quantity: 1
        });
      }
    });
  }
}
