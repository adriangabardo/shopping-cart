import { OrderModel, DiscountModel } from '../types/Model';
import { parse_num_range } from './parse_num_range';

/**
 * This method evaluates which discounts are applicable to an order.
 * @param order - The order to evaluate.
 * @param discounts - The discounts to evaluate.
 * @returns All discounts that are applicable to the passed in order.
 */
export const validate_discounts = (order: OrderModel, discounts: DiscountModel[]): DiscountModel[] => {
  /**
   * This filter ensures that the discount is applicable to the order.
   * To do so, it checks that every restriction from the discount is met.
   * It tried to find the product in the order items that matches the restriction,
   * and if it is found, it checks that the quantity is greater than the low bound of the restriction.
   *
   * Currently, it only checks the low bound, but it could be extended to check the high bound as well.
   */
  return discounts.filter((discount) => {
    const restrictionsMatched = discount.restrictions.every((restriction) => {
      const [lowBound] = parse_num_range(restriction.range);
      const orderedProduct = order.items.find((item) => item.product_id === restriction.product_id);

      return orderedProduct && (!lowBound || orderedProduct.quantity >= lowBound);
    });

    return restrictionsMatched;
  });
};
