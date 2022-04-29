import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { W_ProductsService } from '../../services/w-products.service';
import { W_Product } from '../../models/w-product';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';

@Component({
  selector: 'eshop-frontend-women-products-brands',
  templateUrl: './women-products-brands.component.html',
  styles: [],
})
export class WomenProductsBrandsComponent implements OnInit {
  isChecked = false;
  binaryProp = true;
  currentId: string;
  @Input() product: W_Product;
  products: W_Product[] = [];
  filteredProducts: W_Product[] = [];
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: W_ProductsService,
    private catService: CategoriesService
  ) {}

  ngOnInit(): void {
        this._retrieveId();
        this._getProdByBrand();
        this.route.params.subscribe((params) => {
          params.categoryid
            ? this._getProducts([params.categoryid])
            : this._getProdByBrand();
        });
        this._getCategories();
  }

  private _retrieveId() {
    this.route.params.subscribe((params) => {
      this.currentId = params.brandId;
      console.log(this.currentId);
    });
  }

  private _getProdByBrand(categoriesFilter?: string[]) {
    this.productsService.getWProducts(categoriesFilter).subscribe((products) => {
      this.products = products;
      const filtered = this.products.filter(
        (prod) => prod.brand === this.currentId
      );
      console.log(filtered);
      this.filteredProducts = filtered;

      const uniqueProds = [
        ...this.filteredProducts
          .reduce((map, obj) => map.set(obj.name, obj), new Map())
          .values(),
      ];

      this.filteredProducts = uniqueProds;
    });
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.productsService
      .getWProducts(categoriesFilter)
      .subscribe((resProducts) => {
        this.products = resProducts;
      });
  }

  private _getCategories() {
    this.catService.getCategories().subscribe((resCats) => {
      this.categories = resCats;
    });
  }

  categoryFilter() {
    const selectedCategories = this.categories
      .filter((category) => category.checked)
      .map((category) => category.id);
    console.log(selectedCategories);
    this._getProdByBrand(selectedCategories);
  }
}
