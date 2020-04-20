import { Observable } from 'rxjs';
import { ShoppingCartService } from './../shopping-cart.service';
import { AppUser } from './../models/app-user';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { map } from 'rxjs/operators';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService, private cartService: ShoppingCartService) {
   }

   async ngOnInit() {
     this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
     this.cart$ = await this.cartService.getCartPromise();
   }

  logout() {
    this.auth.logout();
  }

}
