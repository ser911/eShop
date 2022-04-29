import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { W_Product } from '../models/w-product';
@Injectable({
  providedIn: 'root',
})
export class W_ProductsService {
  apiUrlW_Products = environment.apiURL + 'women-products';

  constructor(private http: HttpClient) {}

  getWProducts(categoriesFilter?: string[]): Observable<W_Product[]> {
    let params = new HttpParams();
    if (categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
      console.log(params);
    }
    return this.http.get<W_Product[]>(this.apiUrlW_Products, {
      params: params,
    });
  }

  getWProduct(productId: string): Observable<W_Product> {
    return this.http.get<W_Product>(`${this.apiUrlW_Products}/${productId}`);
  }

  updateWProduct(
    productData: FormData,
    productid: string
  ): Observable<W_Product> {
    return this.http.put<W_Product>(
      `${this.apiUrlW_Products}/${productid}`,
      productData
    );
  }
  createProduct(productData: FormData): Observable<W_Product> {
    return this.http.post<W_Product>(this.apiUrlW_Products, productData);
  }

  deleteWProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlW_Products}/${productId}`);
  }
}