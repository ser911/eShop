import {Variant} from  '../../../../products/src/lib/models/variant';

export class OrderItem {
    product?: string;
    quantity?: number;
    variant?: Variant;
}