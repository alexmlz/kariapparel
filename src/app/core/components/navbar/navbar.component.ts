import { Observable } from 'rxjs';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { AppUser } from 'shared/models/app-user';
import { AuthService } from 'shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { faTshirt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faTshirt = faTshirt;
  faShoppingCart = faShoppingCart;
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
