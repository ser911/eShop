import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrandsService, CategoriesService, Category } from '@eshop-frontend/products';
import { Brand } from '@eshop-frontend/products';
import { takeUntil, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'eshop-frontend-nav',
  templateUrl: './nav.component.html',
  styles: [],
})
export class NavComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  womenCategories: Category[] = [];
  brands: Brand[] = [];
  womenBrands: Brand[] = [];
  endSubs$: Subject<any> = new Subject();

  visible = false;

  constructor(
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getCategories();
    this._getBrands();
  }

  ngOnDestroy(): void {
    this.endSubs$.complete();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
        this.womenCategories = categories.filter((x)=> x.w === true)
      });
  }

  private _getBrands() {
    this.brandsService
      .getBrands()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((brands) => {
        this.brands = brands;
        this.womenBrands = this.brands.filter((x)=> x.w === true);
      });
  }

  navigateToBrand(brandId) {
    this.router.navigate([`/products/brand/${brandId}`]);
  }

  navigateToCat(catId) {
    this.router.navigate(['/products/category/' + catId ]);
    console.log(catId);
  }
}
