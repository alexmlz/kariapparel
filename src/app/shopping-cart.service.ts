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

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart(): Promise<AngularFireObject<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId);
  }

  async getCartPromise(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges().pipe(
      map((x: ShoppingCart) => new ShoppingCart(x.items))
    );
  }

  private getItem(cartId: string, productId: string) {
   return this.db.object('shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId() {
    const cartId = localStorage.getItem('cartId');
    // tslint:disable-next-line: curly
    if (cartId) return cartId;

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return cartId;

  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key);
    item$.valueChanges()
    .pipe(take(1)).subscribe((item: ShoppingCartItem) => {
      // tslint:disable-next-line: curly
      if (!item) item.quantity = 0;
      // vs code is showing error but its working need to check ng build if its working or not
      item$.update({ product, quantity: (item.quantity || 0) + change});
    });
  }
}
