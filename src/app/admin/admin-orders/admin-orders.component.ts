import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent {
  orders$;

  constructor(private orderService: OrderService) {
    this.orders$ = orderService.getOrders().snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
      })
    );
  }
}
