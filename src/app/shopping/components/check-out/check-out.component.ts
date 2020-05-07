import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { OrderService } from 'shared/services/order.service';
import { AuthService } from 'shared/services/auth.service';
import { Order } from 'shared/models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  cart$: Observable<ShoppingCart>;
  cart;
  userId;
  paymentDetails;
  cartPPItems: any[] = [];
  userSubscription: Subscription;
  public payPalConfig ?: IPayPalConfig;

  constructor(
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone) {}

  async ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
    this.cart$ = await this.cartService.getCartPromise();
    this.cart$.subscribe(
      cart => {
        this.cart = cart;
        this.cart.items.forEach(element => {
          this.cartPPItems.push(
            {
              name: element.title,
              quantity: element.quantity,
              // category: 'DIGITAL_GOODS',
              unit_amount: {
                  currency_code: 'EUR',
                  value: element.price,
              }
          });
        });
      }
    );
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AdN5F8ciPVMfERecIQH3JF2onRRq-RLMR2kmhLA6_WOl2-PxRIokiR1JICAVHEPntebiVzEBudWgm2Nz',
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: this.cart.totalPrice,
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: this.cart.totalPrice
                        }
                    }
                },
                items: this.cartPPItems
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then( details => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
              this.paymentDetails = details;
            });
        },
        onClientAuthorization: async (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            const order = new Order(this.userId, null , this.cart , this.paymentDetails);
            const result = await this.orderService.placeOrder(order);
            this.ngZone.run(() =>  this.router.navigate(['order-success', result.key]));
            // this.showSuccess = true;
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            // this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            // this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        }
    };
}

}
