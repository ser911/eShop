import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrlProducts = environment.apiURL + 'products';

  constructor(private http: HttpClient) {}

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
      console.log(params);
      
    }
    return this.http.get<Product[]>(this.apiUrlProducts, { params: params });
  }


  getProductsByBrand(brandId: string): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrlProducts}/brand/${brandId}`)
  }

  getProduct(productId: string): Observable<Product> {
   return this.http.get<Product>(`${this.apiUrlProducts}/${productId}`);
 }

 getProductByName(prodName: string): Observable<Product[]>{
   return this.http.get<Product[]>(`${this.apiUrlProducts}/prodname/${prodName}`)
 }
 
  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrlProducts, productData);
  }
  
  updateProduct(productData: FormData, productid: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrlProducts}/${productid}`, productData);
  }

  updateProductWithVariant(productData: FormData, productid: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrlProducts}/${productid}/add/variant`, productData);
  }


deleteProduct(productId: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrlProducts}/${productId}`);
}

getProductsCount(): Observable<number> {
  return this.http
    .get<number>(`${this.apiUrlProducts}/get/count`)
    .pipe(map((objectValue: any) => objectValue.productCount));
}

getFeaturedProducts(): Observable<Product[]>{
  return this.http.get<Product[]>(`${this.apiUrlProducts}/get/featured/`);
}

addGallery(productId: string, galleryFormData: FormData): Observable<Product>{
  return this.http.put<Product>(`${this.apiUrlProducts}/gallery-images/${productId}`, galleryFormData)
}

}
