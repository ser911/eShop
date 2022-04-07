// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Variant } from "@eshop-frontend/categoriesService";

export class Cart {
    items?: CartItem[];
}

export class CartItem{
    productId?: string;
    quantity?: number;
    variants?: Variant[];
}

export class CartItemDetailed{
    product?: any;
    quantity?: number;
    variants?: Variant[];

}