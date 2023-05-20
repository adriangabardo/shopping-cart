import { OrderItem } from '@/types/Entity/OrderItem.types';
import { BaseRepository } from './BaseRepository';
import { TABLE_NAME } from '@/types';
import { isDatabaseError } from '@/util/database';

export class OrderItemRepository extends BaseRepository<OrderItem> {
  protected TABLE_NAME: TABLE_NAME = TABLE_NAME.ORDER_ITEM;

  /**
   * Create a new order item in the database.
   * Product and Discounts are dynamically selected from the database.
   * @param entity - An OrderItem entity without a product or discounts.
   */
  async create(entity: Omit<OrderItem, 'product' | 'discounts'>): Promise<OrderItem> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING product_id, order_id`;
      const values = [entity.productId, entity.orderId, entity.quantity];

      return await this.client.query(query, values).then((result) => {
        if (!result || !result.rows || result.rows.length < 1) throw new Error('Discount not created');
        return this.findById([result.rows[0].product_id, result.rows[0].order_id]);
      });
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async update(entity: Omit<OrderItem, 'product' | 'discounts'>): Promise<OrderItem> {
    try {
      const query = `UPDATE ${this.TABLE_NAME} SET quantity = $1 WHERE product_id = $2 AND order_id = $3`;
      const values = [entity.quantity, entity.productId, entity.orderId];
      return await this.client.query(query, values).then(() => this.findById([entity.productId, entity.orderId]));
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async delete(compositeId: string[]): Promise<void> {
    if (!compositeId || compositeId.length < 2) {
      throw new Error('Invalid composite id, must be tuple of [productId, orderId]');
    }

    try {
      const query = `DELETE FROM ${this.TABLE_NAME} WHERE product_id = $1 AND order_id = $2`;

      const [productId, orderId] = compositeId;
      const values = [productId, orderId];

      await this.client.query(query, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  /**
   * Query the database for an order item by its composite ID.
   * The composite ID is a tuple of [productId, orderId].
   * @param compositeId - Tuple of [productId, orderId]
   * @returns @type {Promise<OrderItem>} - The order item with the given composite ID.
   */
  async findById(compositeId: string[]): Promise<OrderItem> {
    if (!compositeId || compositeId.length < 2) {
      throw new Error('Invalid composite id, must be tuple of [productId, orderId]');
    }

    /**
     * This SQL query selects the order ID, product ID, quantity, discounts, and product details for a given product and order.
     *
     * The discounts are obtained by joining the DISCOUNTS and RESTRICTIONS tables based on the product ID,
     * and asserting that the quantity falls within the range specified in the restrictions. (We are only checking for lower bound currently).
     * The discounts are then returned as a JSON object.
     *
     * The product information is obtained by selecting the name and price from the PRODUCTS table based on the product ID, and returned as a JSON object.
     */
    const query = `
        SELECT
            order_item.order_id,
            order_item.product_id,
            order_item.quantity,
            (
                SELECT json_build_object('discountType', d.discount_type, 'amount', d.amount, 'explanation', d.explanation)
                FROM DISCOUNTS d
                JOIN RESTRICTIONS r ON d.id = r.discount_id
                WHERE r.product_id = order_item.product_id
                  AND (lower(r.range) <= CAST(order_item.quantity AS numeric) OR r.range IS NULL)
              ) AS discounts,
            (
				SELECT json_build_object('name', product.name, 'price', product.price)
				FROM PRODUCTS product
				WHERE product.id = order_item.product_id
			) as product
        FROM
            ${this.TABLE_NAME} order_item
        WHERE
            order_item.product_id = $1
            AND order_item.order_id = $2;
    `;

    const [productId, orderId] = compositeId;
    const values = [productId, orderId];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return {
      orderId: rows[0].order_id,
      productId: rows[0].product_id,
      discounts: rows[0].discounts,
      product: rows[0].product,
      quantity: rows[0].quantity,
    };
  }

  async findAll(): Promise<OrderItem[]> {
    /**
     * This query is just like the one in findById,
     * except it does not include a WHERE clause, so it returns all order items.
     */
    const query = `
        SELECT
            order_item.order_id,
            order_item.product_id,
            order_item.quantity,
            (
                SELECT json_build_object('discountType', d.discount_type, 'amount', d.amount, 'explanation', d.explanation)
                FROM DISCOUNTS d
                JOIN RESTRICTIONS r ON d.id = r.discount_id
                WHERE r.product_id = order_item.product_id
                  AND (lower(r.range) <= CAST(order_item.quantity AS numeric) OR r.range IS NULL)
              ) AS discounts,
            (
				SELECT json_build_object('name', product.name, 'price', product.price)
				FROM PRODUCTS product
				WHERE product.id = order_item.product_id
			) as product
        FROM ${this.TABLE_NAME} order_item;
    `;

    const { rows } = await this.client.query(query);

    return rows.map<OrderItem>((row) => ({
      orderId: row.order_id,
      productId: row.product_id,
      discounts: row.discounts,
      product: row.product,
      quantity: row.quantity,
    }));
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const query = `
        SELECT
            order_item.order_id,
            order_item.product_id,
            order_item.quantity,
            (
                SELECT json_build_object('discountType', d.discount_type, 'amount', d.amount, 'explanation', d.explanation)
                FROM DISCOUNTS d
                JOIN RESTRICTIONS r ON d.id = r.discount_id
                WHERE r.product_id = order_item.product_id
                  AND (lower(r.range) <= CAST(order_item.quantity AS numeric) OR r.range IS NULL)
              ) AS discounts,
            (
				SELECT json_build_object('name', product.name, 'price', product.price)
				FROM PRODUCTS product
				WHERE product.id = order_item.product_id
			) as product
        FROM ${this.TABLE_NAME} order_item
        WHERE order_item.order_id = $1;
    `;

    const values = [orderId];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return rows.map<OrderItem>((row) => ({
      orderId: row.order_id,
      productId: row.product_id,
      discounts: row.discounts,
      product: row.product,
      quantity: row.quantity,
    }));
  }

  async findByProductId(productId: string): Promise<OrderItem[]> {
    const query = `
        SELECT
            order_item.order_id,
            order_item.product_id,
            order_item.quantity,
            (
                SELECT json_build_object('discountType', d.discount_type, 'amount', d.amount, 'explanation', d.explanation)
                FROM DISCOUNTS d
                JOIN RESTRICTIONS r ON d.id = r.discount_id
                WHERE r.product_id = order_item.product_id
                  AND (lower(r.range) <= CAST(order_item.quantity AS numeric) OR r.range IS NULL)
              ) AS discounts,
            (
				SELECT json_build_object('name', product.name, 'price', product.price)
				FROM PRODUCTS product
				WHERE product.id = order_item.product_id
			) as product
        FROM ${this.TABLE_NAME} order_item
        WHERE order_item.product_id = $1;
    `;

    const values = [productId];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return rows.map<OrderItem>((row) => ({
      orderId: row.order_id,
      productId: row.product_id,
      discounts: row.discounts,
      product: row.product,
      quantity: row.quantity,
    }));
  }
}
