import { OrderItemModel } from './OrderItemModel.types';

/**
 * An order is a collection of products that a customer intends to or has purchased.
 */
export interface OrderModel {
  /**
   * An UUID auto-generated by the database
   */
  id: string;
  /**
   * The date the order was created, auto-generated by the database
   */
  created_date: Date;
  /**
   * The items being ordered.
   * These are stored as a one-to-many relationship in the ORDER_ITEMS table.
   */
  items: OrderItemModel[];
}
