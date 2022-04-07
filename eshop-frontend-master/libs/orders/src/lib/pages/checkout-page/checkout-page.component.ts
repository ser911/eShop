import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '@eshop-frontend/users';
import { OrderItem } from '../../models/order-item';
import { Order } from '../../models/order';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrdersService } from '../../services/orders.service';
import { ORDER_STATUS } from '../../order.constants';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit {

  constructor(private router: Router,
              private usersService: UsersService,
              private formBuilder: FormBuilder,
              private cartService: CartService,
              private ordersService: OrdersService,
              private messageService: MessageService) {}

    checkoutFormGroup: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId: string;
    countries = [];
     unsubscribe$: Subject<any> = new Subject();

              

  ngOnInit(): void {
    this._initUserForm();
    this._autoFillUserData();
    this._getCountries();
    this._getCartItems();
  }

  private _initUserForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }


  private _autoFillUserData() {
    this.usersService
      .observeCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        if (user) {
          this.userId = user.id;
          this.checkoutForm.name.setValue(user.name);
          this.checkoutForm.email.setValue(user.email);
          this.checkoutForm.phone.setValue(user.phone);
          this.checkoutForm.city.setValue(user.city);
          this.checkoutForm.street.setValue(user.street);
          this.checkoutForm.country.setValue(user.country);
          this.checkoutForm.zip.setValue(user.zip);
          this.checkoutForm.apartment.setValue(user.apartment);
        }
      });
  }

  private _getCartItems(){
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item) =>{
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
    console.log(this.orderItems);
    
  }

  private _getCountries(){    
    this.countries = this.usersService.getCountries();
    console.log(this.countries);
  }


  backToCart(){
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order ={
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm.street.value,
      shippingAddress2: this.checkoutForm.apartment.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`,
    }

    this.ordersService.createOrder(order).subscribe(()=>{

      this.cartService.emptyCart();
      this.router.navigate(['/success']);
      
    }, ()=>{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Order could not be created`
      });
    });
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

}
