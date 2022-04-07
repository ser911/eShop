import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@eshop-frontend/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {
orders: Order[] = [];
orderStatus = ORDER_STATUS;
endsubs$: Subject<any> = new Subject();



  constructor(private ordersService: OrdersService,
               private router: Router,
               private confirmationService: ConfirmationService,
               private messageService: MessageService) {}

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy() {
    this.endsubs$.complete();
  }



  _getOrders(){
    this.ordersService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe((orders)=>{
      this.orders = orders;
      console.log(orders);
      
    })
  }
  showOrder(orderId){
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId).pipe(takeUntil(this.endsubs$)).subscribe(
          () => {
            this._getOrders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order is deleted!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not deleted!'
            });
          }
        );
      }
    });
  }


}
