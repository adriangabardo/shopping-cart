// @ts-nocheck

import { Discount } from '../types';
import { Order } from '../types/Entity/Order.types';

export const calculate_total_cost = (order: Order, uniqueDiscounts: Discount[]) => {
  return Number(
    uniqueDiscounts.reduce((previous, current) => {
      if (current.discountType === 'PERCENTAGE') return previous - previous * current.amount;
      else if (current.discountType === 'FIXED') return previous - current.amount;
      else return previous;
    }, order.total)
  ).toFixed(2);
};
