import { W_Product } from "./w-product";

export class W_Variant {
  id?: string;
  product?: W_Product;
  size?: string;
  inventory?: number;
  barcode?: number;
  available?: boolean;
}
