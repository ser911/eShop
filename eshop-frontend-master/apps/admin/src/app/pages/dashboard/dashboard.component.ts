import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@eshop-frontend/orders';
import { ProductsService } from '@eshop-frontend/products';
import { UsersService } from '@eshop-frontend/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',

})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = [];
  endsubs$: Subject<any> = new Subject();


  constructor( private userService: UsersService,
               private productService: ProductsService,
               private ordersService: OrdersService
               ) {}           

ngOnInit(): void {
  combineLatest([
    this.ordersService.getOrdersCount(),
    this.productService.getProductsCount(),
    this.userService.getUsersCount(),
    this.ordersService.getTotalSales()
  ])
    .pipe(takeUntil(this.endsubs$))
    .subscribe((values) => {
      this.statistics = values;
    });
}

ngOnDestroy() {
  this.endsubs$.complete();
}

}
