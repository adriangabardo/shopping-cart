import { DiscountModel, OrderModel } from '../types/Model';

/**
 * This method calculates the total cost of an order, and the total cost after applying discounts.
 * @param order - The order to calculate the total cost of.
 * @param discounts - The discounts to apply to the order. This assumes that the discounts are applicable to the order.
 * @returns The total cost of the order, and the total cost after applying discounts.
 */
export const calculate_cart_total = (
  order: OrderModel,
  discounts: DiscountModel[]
): {
  total: number;
  discountedTotal: number;
} => {
  /**
   * Calculates the initial total cost of the order.
   * Does so by multiplying the quantity of each item by its price and summing all the items.
   */
  const total = order.items.reduce((previous, current) => {
    return previous + current.quantity * current.product_price;
  }, 0);

  /**
   * Calculates the final discounted total cost of the order.
   * Does so by applying each discount to the total cost.
   */
  const discountedTotal = discounts.reduce((previous, current) => {
    if (current.discount_type === 'PERCENTAGE') return previous - previous * current.amount;
    else if (current.discount_type === 'FIXED') return previous - current.amount;
    else return previous;
  }, total);

  return { discountedTotal, total };
};
