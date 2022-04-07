import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'eshop-frontend-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [
  ]
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {

  featuredProducts: Product[] = [];
  endSubs$ : Subject<any>= new Subject();

  constructor(private prodService: ProductsService ) { }

  ngOnInit(): void {
    this._getFeaturedProducts()
  }

  ngOnDestroy(): void {
      this.endSubs$.complete();
  }

  private _getFeaturedProducts(){
    this.prodService.getFeaturedProducts().pipe(takeUntil(this.endSubs$)).subscribe(products =>{
      this.featuredProducts = products;
    })
  }

}
