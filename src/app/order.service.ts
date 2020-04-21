import { ShoppingCartService } from './shopping-cart.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private cartServcie: ShoppingCartService) { }

  async placeOrder(order) {
    const result = await  this.db.list('/orders').push(order);
    // better to Use a tranaction
    this.cartServcie.clearCart();
    return result;
  }

  getOrders() {
    return this.db.list('/orders');
  }

  getOrdersByUser(userId: string) {
    return this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId));
    // return this.db.list('/orders');
  }
}
