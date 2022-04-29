/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '@eshop-frontend/orders';
import { Product } from '../../models/product';


@Component({
  selector: 'eshop-frontend-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {
  w = false;
  url;

  @Input() product: Product;

  constructor(private cartService: CartService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this._retrieveParam();
    
  }

  private _retrieveParam(){
 
    this.url = this.route.url;
    console.log(this.url.value[0].path);
    console.log(this.url);
    
    if (this.url.value[0].path === 'women-products') {
      this.w = true;
    }
    console.log(this.w);
    
  }

  // addProductToCart(){
  //   const cartItem: CartItem = {
  //     productId: this.product.id,
  //     quantity: 1
  //   }

  //   this.cartService.setCartItem(cartItem);
  // }

}
