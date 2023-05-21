export interface DiscountModel {
  /**
   * An UUID auto-generated by the database
   */
  id: string;
  /**
   * Dictates whether the discount is a percentage of total price or a fixed amount
   */
  discount_type: 'FIXED' | 'PERCENTAGE';
  /**
   * The amount of the discount, either a percentage or a fixed amount
   */
  amount: number;
  /**
   * A human friendly explanation of the discount
   */
  explanation: string;
}
