/**
 * This interface represents a product in the store.
 */
export interface Product {
  // The SKU of the product
  id: string;
  name: string;
  price: number;
  inventory: number;
}
