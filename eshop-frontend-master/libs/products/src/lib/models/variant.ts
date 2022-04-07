import { Product } from "./product";

export class Variant {
    id?: string;
    product?: Product;
    size?: string;
    inventory?:number;
    barcode?: number;
    available?: boolean;
}