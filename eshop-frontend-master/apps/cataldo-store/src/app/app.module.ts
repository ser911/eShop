import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@eshop-frontend/ui';
import { AccordionModule } from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@eshop-frontend/products';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@eshop-frontend/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JwtInterceptor ,UsersModule } from '@eshop-frontend/users';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faS } from '@fortawesome/free-solid-svg-icons';
import { faR } from '@fortawesome/free-solid-svg-icons';





const routes: Routes = [
  { path: '', component: HomePageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    UiModule,
    AccordionModule,
    BrowserAnimationsModule,
    ProductsModule,
    UiModule,
    HttpClientModule,
    OrdersModule,
    ToastModule,
    UsersModule,
    FontAwesomeModule
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [
    MessagesComponent
  ],
})
export class AppModule {
  constructor(){
    library.add(faR,faS)
  }
}
