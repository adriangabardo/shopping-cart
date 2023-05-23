/**
 * An order item is a product that has been added to an order.
 * It is a many-to-many bridging table between the ORDERS and PRODUCTS tables.
 */
export interface OrderItemModel {
  /**
   * A foreign key representing the order ID in the ORDERS table.
   */
  order_id: string;
  /**
   * A foreign key representing the product ID in the PRODUCTS table.
   */
  product_id: string;
  /**
   * The product name, not actually stored in the ORDER_ITEMS table.
   * This value is retrieved in the SQL query.
   */
  product_name: string;
  /**
   * The product price, not actually stored in the ORDER_ITEMS table.
   * This value is retrieved in the SQL query.
   */
  product_price: number;
  /**
   * How many of the product are being ordered.
   * This is validated during checkout to make sure enough stock is available.
   */
  quantity: number;
}
