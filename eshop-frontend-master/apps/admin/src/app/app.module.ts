//General
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, JwtInterceptor, UsersModule } from '@eshop-frontend/users';

//Components
import { AppComponent } from './app.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { VariantsFormComponent } from './pages/variants/variants-form/variants-form.component';
import { VariantsListComponent } from './pages/variants/variants-list/variants-list.component';

//PrimeNg modules
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CategoriesService } from '@eshop-frontend/products';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { BadgeModule } from 'primeng/badge';
import { FieldsetModule } from 'primeng/fieldset';

//State
import {  StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrandsListComponent } from './pages/brands/brands-list/brands-list.component';
import { BrandsFormComponent } from './pages/brands/brands-form/brands-form.component';
import { GalleryUploadComponent } from './pages/products/products-form/gallery-upload/gallery-upload.component';
import { VariantsFormEditComponent } from './pages/variants/variants-form-edit/variants-form-edit.component';




//PrimeNg modules array
const UX_MODULES = [  
                    CardModule,
                    TableModule,
                    ToolbarModule,
                    ButtonModule,
                    InputTextModule,
                    ToastModule,
                    ConfirmDialogModule,
                    ColorPickerModule,
                    InputNumberModule,
                    DropdownModule,
                    InputTextareaModule,
                    InputSwitchModule,
                    EditorModule,
                    PaginatorModule,
                    TagModule,
                    InputMaskModule,
                    BadgeModule,
                    FieldsetModule
                  ];


//Routing center                    
const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/form', component: CategoriesFormComponent },
      { path: 'categories/form/:id', component: CategoriesFormComponent },
      { path: 'brands', component: BrandsListComponent},
      { path: 'brands/form', component: BrandsFormComponent},
      { path: 'brands/form/:id', component: BrandsFormComponent},
      { path: 'products', component: ProductsListComponent },
      { path: 'products/form', component: ProductsFormComponent },
      { path: 'products/form/:id', component: ProductsFormComponent },
      { path: 'variants/product/:id', component: VariantsListComponent },
      { path: 'variants/product/:id/form', component: VariantsFormComponent},
      { path: 'variants/product/:id/form/edit', component: VariantsFormEditComponent},     
      { path: 'users', component: UsersListComponent },
      { path: 'users/form', component: UsersFormComponent },
      { path: 'users/form/:id', component: UsersFormComponent },
      { path: 'orders', component: OrdersListComponent },
      { path: 'orders/:id', component: OrdersDetailComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ],
  },
];


//NgModule
@NgModule({
  declarations: [
     AppComponent,
     DashboardComponent,
     ShellComponent,
     SidebarComponent,
     CategoriesListComponent,
     CategoriesFormComponent,
     ProductsListComponent,
     ProductsFormComponent,
     UsersListComponent,
     UsersFormComponent,
     OrdersListComponent,
     OrdersDetailComponent,
     VariantsFormComponent,
     VariantsListComponent,
     BrandsListComponent,
     BrandsFormComponent,
     GalleryUploadComponent,
     VariantsFormEditComponent
     ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    UsersModule,
    ...UX_MODULES
  ],
  providers: [CategoriesService, MessageService, ConfirmationService, 
  {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})

//Export line
export class AppModule {}
