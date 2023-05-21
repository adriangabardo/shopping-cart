import { DiscountModel, RestrictionModel } from '../Model';

/**
 * When querying for discounts,
 * we should do a join on the restrictions table with the
 * products table to get the product name.
 */
export type Restrictions = RestrictionModel & { productName: string };

export type Discount = DiscountModel & {
  /**
   * The restrictions that must be met for the discount to apply.
   * All restrictions must be met for the discount to apply.
   */
  restrictions: Restrictions[];
};
