import { Discount } from './Discount.types';

export interface OrderItem {
  /**
   * Foreign key to the product table.
   * Part of the composite primary key.
   */
  productId: string;
  /**
   * Foreign key to the order table.
   * Part of the composite primary key.
   */
  orderId: string;

  product: {
    name: string;
    price: number;
  };
  /**
   * How many of the product were ordered.
   */
  quantity: number;
  discounts: Discount[];
}
