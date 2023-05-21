// @ts-nocheck

import { Discount } from '../types/Entity';
import { Order } from '../types/Entity/Order.types';

export const uniqueDiscounts = (order: Order) =>
  order.items.reduce((previous, current) => {
    current.discounts.forEach((discount) => {
      const existingDiscount = previous.find((d) => d.id === discount.id);
      if (!existingDiscount) {
        previous.push(discount);
      }
    });

    return previous;
  }, [] as Discount[]);
