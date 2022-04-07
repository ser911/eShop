import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators'
import { environment } from "@env/environment";
import { Variant } from "../models/variant";

@Injectable({
    providedIn: 'root',
})

export class VariantsService{
    apiUrlVariants = environment.apiURL + 'variants';

    constructor(private http: HttpClient){}

    getVariants(): Observable<Variant[]>{
        return this.http.get<Variant[]>(this.apiUrlVariants);
    }

    getVariant(variantId: string): Observable<Variant> {
        return this.http.get<Variant>(`${this.apiUrlVariants}/product/${variantId}/form/edit`);
    }

    getProdVariants(productId): Observable<Variant[]>{
        return this.http.get<Variant[]>(`${this.apiUrlVariants}/product/${productId}`);
    }

    createVariant(variantData: FormData): Observable<Variant> {
        return this.http.post<Variant>(this.apiUrlVariants, variantData);
      }

    updateVariant(variantData: FormData, variantId: string): Observable<Variant> {
        return this.http.put<Variant>(`${this.apiUrlVariants}/product/${variantId}/form/edit`,variantData);
    }

    deleteVariant(variantId: string){
        return this.http.delete<any>(`${this.apiUrlVariants}/${variantId}`)
    }
}