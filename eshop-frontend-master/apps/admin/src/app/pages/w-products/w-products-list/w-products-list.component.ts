import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {W_ProductsService, W_Product, Brand, BrandsService } from '@eshop-frontend/products';
import { Product } from '@eshop-frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'eshop-frontend-w-products-list',
  templateUrl: './w-products-list.component.html',
  styles: [],
})
export class WProductsListComponent implements OnInit {
  W_products: W_Product[];
  brands: Brand[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private WproductsService: W_ProductsService,
    private brandsService: BrandsService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this._getWProducts();
    this._getBrands();
  }

  private _getWProducts() {
    this.WproductsService.getWProducts().subscribe((prods) => {
      this.W_products = prods;
      console.log(this.W_products);
    });
  }
  private _getBrands() {
    this.brandsService.getBrands().subscribe((brands) => {
      this.brands = brands;
      console.log(this.brands);
    });
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.WproductsService.deleteWProduct(productId)
          .pipe(takeUntil(this.endsubs$))
          .subscribe(
            () => {
              this._getWProducts();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product is deleted!',
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product is not deleted!',
              });
            }
          );
      },
    });
  }

  updateProduct(productId: string) {
    this.router.navigateByUrl(`women-products/form/${productId}`);
  }

  goToVariants(productId) {
    this.router.navigate(['/variants/women-product/', productId]);
  }
}
