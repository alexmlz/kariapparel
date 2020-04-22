import { NgModule } from '@angular/core';

import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { SharedModule } from 'shared/shared.module';
import { AppRoutingModule } from 'app/app-routing.module';



@NgModule({
  declarations: [
    ProductFormComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    AdminAuthGuard
  ]
})
export class AdminModule { }
