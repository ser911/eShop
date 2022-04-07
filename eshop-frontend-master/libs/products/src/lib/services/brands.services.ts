import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import {environment} from '@env/environment';


@Injectable({
  providedIn: 'root',
})
export class BrandsService {
 apiUrlBrands = environment.apiURL + 'brands';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrlBrands);
  }
  getBrand(brandId: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrlBrands}/${brandId}`);
  }

  createBrand(brandData: FormData): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrlBrands, brandData);
  }
  updateBrand(brandData: FormData, brandId: string): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrlBrands}/${brandId}`, brandData);
  }

  deleteBrand(brandId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlBrands}/${brandId}`);
  }
}
