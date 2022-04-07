import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'eshop-frontend-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {
  isChecked = false
  products: Product[] = [];
  categories: Category[] = [];
  binaryProp = true;
  isCategoryPage: boolean;

  constructor(private prodService: ProductsService,
              private catService: CategoriesService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? this.isCategoryPage = true : this.isCategoryPage = false;
    })
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.prodService.getProducts(categoriesFilter).subscribe((resProducts) => {
      this.products = resProducts;

      console.log(this.products); 

      const uniqueProds = [...this.products.reduce((map, obj) => map.set(obj.name, obj), new Map()).values()];
      
      console.log(uniqueProds);

      this.products = uniqueProds;
    });
  }

  private _getCategories(){
    this.catService.getCategories().subscribe(resCats =>{
      this.categories = resCats;
    })
  }

   /* eslint-disable */

 categoryFilter() {
  const selectedCategories = this.categories
  .filter((category) => category.checked )
  .map((category)=> category.id)
  console.log(selectedCategories);

  this._getProducts(selectedCategories);

  } 


}