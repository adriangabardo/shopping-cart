import { DiscountModel, OrderModel } from '../types/Model';
import { parse_num_range } from './parse_num_range';

export const calculate_cart_total = (
  order: OrderModel,
  discounts: DiscountModel[]
): {
  total: number;
  discountedTotal: number;
  appliedDiscounts: DiscountModel[];
} => {
  /**
   * This filter ensures that the discount is applicable to the order.
   * To do so, it checks that every restriction from the discount is met.
   * It tried to find the product in the order items that matches the restriction,
   * and if it is found, it checks that the quantity is greater than the low bound of the restriction.
   *
   * Currently, it only checks the low bound, but it could be extended to check the high bound as well.
   */
  const appliedDiscounts = discounts.filter((discount) => {
    const restrictionsMatched = discount.restrictions.every((restriction) => {
      const [lowBound] = parse_num_range(restriction.range);
      const orderedProduct = order.items.find((item) => item.product_id === restriction.product_id);

      return orderedProduct && (!lowBound || orderedProduct.quantity >= lowBound);
    });

    return restrictionsMatched;
  });

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
  const discountedTotal = appliedDiscounts.reduce((previous, current) => {
    if (current.discount_type === 'PERCENTAGE') return previous - previous * current.amount;
    else if (current.discount_type === 'FIXED') return previous - current.amount;
    else return previous;
  }, total);

  return { appliedDiscounts, discountedTotal, total };
};
