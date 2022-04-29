import { Component, OnInit } from '@angular/core';
import { W_ProductsService } from '../../services/w-products.service';
import { W_Product } from '../../models/w-product';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eshop-frontend-women-products-list',
  templateUrl: './women-products-list.component.html',
  styles: [],
})
export class WomenProductsListComponent implements OnInit {
  isChecked = false;
  products: W_Product[] = [];
  categories: Category[] = [];
  binaryProp = true;
  isCategoryPage: boolean;

  constructor(
    private prodService: W_ProductsService,
    private catService: CategoriesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? this.isCategoryPage = true : this.isCategoryPage = false;
    })
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.prodService.getWProducts(categoriesFilter).subscribe((resProducts) => {
      this.products = resProducts;

      const uniqueProds = [
        ...this.products
          .reduce((map, obj) => map.set(obj.name, obj), new Map())
          .values(),
      ];

      this.products = uniqueProds;

      console.log(uniqueProds);
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

    this._getProducts(selectedCategories);
  }
}
