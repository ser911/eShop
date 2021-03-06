import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { W_ProductsService } from '../../services/w-products.service';
import { W_Product } from '../../models/w-product';

@Component({
  selector: 'eshop-frontend-products-brands',
  templateUrl: './products-brands.component.html',
  styles: [
  ]
})
export class ProductsBrandsComponent implements OnInit {
  isChecked = false;
  binaryProp = true;
  currentId: string;
  brandName: string;
  @Input() product: Product;
  products: Product[] = [];
  wProds: W_Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  constructor(private route: ActivatedRoute,
              private productsService: ProductsService,
              private catService : CategoriesService,
              private wProdService: W_ProductsService) { }

  ngOnInit(): void {
    this._retrieveId();
    this._getProdByBrand();
    this.route.params.subscribe((params)=>{
      params.categoryid? this._getProducts([params.categoryid]) : this._getProdByBrand();
    })
    this._getCategories();
  }

  private _retrieveId(){
    this.route.params.subscribe((params)=>{
       this.currentId = params.brandId;
       this.brandName = params.brandName;
       console.log(this.currentId);    
       console.log(this.brandName);     
       
                
      
    })
  }

  private _getProdByBrand(categoriesFilter?: string[]){
    this.productsService.getProducts(categoriesFilter).subscribe((products)=>{
      this.products = products;
  
      
       const filtered = this.products.filter(prod => prod.brand === this.currentId)
      console.log(filtered);
      this.filteredProducts = filtered;

      const uniqueProds = [...this.filteredProducts.reduce((map, obj) => map.set(obj.name, obj), new Map()).values()];
      
      this.filteredProducts = uniqueProds;
      
      
    });    
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.productsService.getProducts(categoriesFilter).subscribe((resProducts) => {
      this.products = resProducts;
    });
  }

  private _getCategories(){
    this.catService.getCategories().subscribe(resCats =>{
      this.categories = resCats;
    })
  }

  categoryFilter(){
    const selectedCategories = this.categories.filter((category)=> category.checked).map((category)=> category.id)
    console.log(selectedCategories);
    this._getProdByBrand(selectedCategories);
    
  }


}
