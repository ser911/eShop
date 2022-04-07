import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { OrdersModule } from '@eshop-frontend/orders';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ButtonModule } from 'primeng/button';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import {RatingModule} from 'primeng/rating';
import {InputNumberModule} from 'primeng/inputnumber';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UiModule } from '@eshop-frontend/ui';
import { ProductsBrandsComponent } from './pages/products-brands/products-brands.component';



const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'products/category/:categoryid',
    component: ProductsListComponent
  },
  {
    path: 'products/:productId',
    component: ProductPageComponent
  },
  {
    path: 'products/brand/:brandId',
    component: ProductsBrandsComponent
  }
]

@NgModule({
  imports: [CommonModule,
            OrdersModule,
            RouterModule.forChild(routes),
            ButtonModule,
            CheckboxModule,
            FormsModule,
            RatingModule,
            InputNumberModule,
            UiModule,
          ],
  declarations: [
    ProductsSearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
    ProductPageComponent,
    ProductsBrandsComponent
  ],
  exports: [
    ProductsSearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent
  ]
})
export class ProductsModule {}
