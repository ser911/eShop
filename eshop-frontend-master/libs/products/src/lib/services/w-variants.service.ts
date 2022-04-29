import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { W_Variant } from "../models/w-variant";

@Injectable({
  providedIn: 'root',
})
export class W_VariantsService {
  apiUrlW_Variants = environment.apiURL + 'w-variants';

  constructor(private http: HttpClient) {}

  getW_Variants(): Observable<W_Variant[]> {
    return this.http.get<W_Variant[]>(this.apiUrlW_Variants);
  }

  getW_Variant(variantId: string): Observable<W_Variant> {
    return this.http.get<W_Variant>(
      `${this.apiUrlW_Variants}/women-product/${variantId}/form/edit`
    );
  }

  getProdW_Variants(productId): Observable<W_Variant[]> {
    return this.http.get<W_Variant[]>(
      `${this.apiUrlW_Variants}/women-product/${productId}`
    );
  }

  createW_Variant(variantData: FormData): Observable<W_Variant> {
    return this.http.post<W_Variant>(this.apiUrlW_Variants, variantData);
  }

  updateW_Variant(variantData: FormData, variantId: string): Observable<W_Variant> {
    return this.http.put<W_Variant>(
      `${this.apiUrlW_Variants}/women-product/${variantId}/form/edit`,
      variantData
    );
  }

  deleteW_Variant(variantId: string) {
    return this.http.delete<any>(`${this.apiUrlW_Variants}/${variantId}`);
  }
}