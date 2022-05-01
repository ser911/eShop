import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries 
import { CartService, CartItem } from '@eshop-frontend/orders';
import { Subject, take, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { W_Product } from '../../models/w-product';
import { ProductsService } from '../../services/products.service';
import { Variant } from '../../models/variant';
import { W_Variant } from '../../models/w-variant';
import { VariantsService } from '../../services/variants.service';
import { Location } from '@angular/common';
import { W_ProductsService } from '../../services/w-products.service';
import { W_VariantsService } from '../../services/w-variants.service';



@Component({
  selector: 'eshop-frontend-product-page',
  templateUrl: './product-page.component.html',
  styles: [],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  variant: Variant;
  variants: Variant[] = [];
  filteredVariants: Variant[] | W_Variant[] = [];
  product: Product;
  W_product: W_Product;
  prodName: string = '';
  W_prodname: string = '';
  menProd = true;
  wProd = false;
  products: Product[] = [];
  len: number;
  colors: string[] = [];
  multipleColors: boolean;
  endSubs$: Subject<any> = new Subject();
  quantity = 1;
  currentId;
  selected = false;
  selectedSize: Variant[] = [];
  availability: any[] = [];
  minInv: number;
  maxInv: number;
  url;
  constructor(
    private prodService: ProductsService,
    private WprodService: W_ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private variantService: VariantsService,
    private wVariantService: W_VariantsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.url = this.route.url;

    if (this.url.value[0].path === 'products') {
      this.route.params.subscribe((params) => {
        if (params.productId) {
          this._getProduct(params.productId);
          this.currentId = params.productId;
          console.log(this.currentId);
          // this.prodName = this.product.name
          // console.log(this.prodName);
        }
      });

      this._getSizes();
    } else {
      this.wProd = true;
      this.menProd = false;
      this.route.params.subscribe((params) => {
        if (params.productId) {
          this._getWproduct(params.productId);
          this.currentId = params.productId;
          console.log(this.currentId);
          // this.prodName = this.product.name
          // console.log(this.prodName);
        }
      });

      this._getWSizes();
    }
  }

  ngOnDestroy(): void {
    this.endSubs$.complete();
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
      variants: this.selectedSize,
    };

    this.cartService.setCartItem(cartItem);
  }

  private _getProduct(id: string) {
    this.prodService
      .getProduct(id)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((resProduct) => {
        this.product = resProduct;
        this.prodName = this.product.name;
        this.getProdByname();
      });
  }

  private _getWproduct(id: string) {
    this.WprodService.getWProduct(id)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((resProduct) => {
        this.product = resProduct;
        this.W_prodname = this.product.name;
        this.getWProdByname();
      });
  }

  _getSizes() {
    this.variantService
      .getVariants()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((variants) => {
        this.variants = variants;
        this.filteredVariants = this.variants.filter(
          (size) => size.product === this.currentId
        );
        this.filteredVariants.sort((a, b) => (a.size < b.size ? -1 : 1));
        console.log(this.filteredVariants);
      });
  }

  _getWSizes() {
    this.wVariantService
      .getW_Variants()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((variants) => {
        this.variants = variants;
        this.filteredVariants = this.variants.filter(
          (size) => size.product === this.currentId
        );
        this.filteredVariants.sort((a, b) => (a.size < b.size ? -1 : 1));
        console.log(this.filteredVariants);
      });
  }

  selectSize(event: any, index) {
    this.selected = true;
    const temp = event.target.innerHTML;
    console.log(temp);

    this.selectedSize = this.filteredVariants.filter((x) => x.size === temp);
    console.log(this.selectedSize);

    if (this.selectedSize[0].inventory >= 1) {
      this.minInv = 1;
      this.maxInv = this.selectedSize[0].inventory;
      this.quantity = this.minInv;
      console.log(this.minInv);
      console.log(this.maxInv);
    }
  }

  getProdByname() {
    this.prodService.getProductByName(this.prodName).subscribe((products) => {
      this.products = products;
      console.log(this.products);

      this.len = this.products.length;
      for (let i = 0; i < this.len; i++) {
        this.colors.push(this.products[i].color);
        console.log(this.products[i].color);
      }
      console.log(this.colors);

      if (this.len > 1) {
        this.multipleColors = true;
      } else {
        this.multipleColors = false;
      }
    });
  }
  getWProdByname() {
    this.WprodService.getProductByName(this.W_prodname).subscribe(
      (products) => {
        this.products = products;
        console.log(this.products);

        this.len = this.products.length;
        for (let i = 0; i < this.len; i++) {
          this.colors.push(this.products[i].color);
          console.log(this.products[i].color);
        }
        console.log(this.colors);

        if (this.len > 1) {
          this.multipleColors = true;
        } else {
          this.multipleColors = false;
        }
      }
    );
  }

  selectColor(prodId) {
    console.log(prodId);
    this._getProduct(prodId);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['products/' + prodId]);
    });
  }

  selectWColor(prodId) {
    console.log(prodId);
    this._getWproduct(prodId);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['women-products/' + prodId]);
    });
  }
}
