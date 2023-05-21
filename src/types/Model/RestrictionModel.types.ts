export interface RestrictionModel {
  id: string;
  discount_id: string;
  /**
   * The product that this restriction applies to.
   * Eg., productId = ABC, range = [1, 3].
   * This means that if the customer buys 1 to 3 of product ABC, they qualify for the discount.
   */
  product_id: string;

  range: [number | null, number | null];
}
