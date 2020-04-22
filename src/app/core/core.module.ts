import { AppRoutingModule } from 'app/app-routing.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
