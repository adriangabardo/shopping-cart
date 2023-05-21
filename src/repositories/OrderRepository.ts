import { Order } from '../types/Entity/Order.types';
import { BaseRepository } from './BaseRepository';
import { TABLE_NAME } from '../types';
import { isDatabaseError } from '../util/database';
import { OrderItemModel } from '@/types/Model';

export class OrderRepository extends BaseRepository<Order> {
  protected TABLE_NAME: TABLE_NAME = TABLE_NAME.ORDERS;

  async create(): Promise<Order> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} DEFAULT VALUES RETURNING id`;

      const result = await this.client.query(query);

      if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].id) throw new Error('Order not created');

      return await this.findById(result.rows[0].id);
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  update(entity: Order): Promise<Order> {
    throw new Error('Orders cannot currently be updated. Add, update and remove items individually.');
  }

  async delete(id: string | string[]): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
      const values = [id];

      await this.client.query(query, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findById(id: string): Promise<Order> {
    const query = `
      SELECT "order".*,
        COALESCE(
          json_agg(json_build_object(
            'product_id', order_item.product_id,
            'order_id', order_item.order_id,
            'quantity', order_item.quantity,
            'name', product.name
          )) FILTER (WHERE order_item.product_id IS NOT NULL),
          '[]'
        ) AS items
      FROM ${this.TABLE_NAME} AS "order"
      LEFT JOIN ${TABLE_NAME.ORDER_ITEM} AS order_item ON "order".id = order_item.order_id
      LEFT JOIN ${TABLE_NAME.PRODUCTS} AS product ON order_item.product_id = product.id
      WHERE "order".id = $1
      GROUP BY "order".id;
    `;

    const values = [id];
    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order not found');

    return rows[0];
  }

  async findAll(): Promise<Order[]> {
    const query = `
      SELECT "order".*,
        COALESCE(
          json_agg(json_build_object(
            'product_id', order_item.product_id,
            'order_id', order_item.order_id,
            'quantity', order_item.quantity,
            'name', product.name
          )) FILTER (WHERE order_item.product_id IS NOT NULL),
          '[]'
        ) AS items
      FROM ${this.TABLE_NAME} AS "order"
      LEFT JOIN ${TABLE_NAME.ORDER_ITEM} AS order_item ON "order".id = order_item.order_id
      LEFT JOIN ${TABLE_NAME.PRODUCTS} AS product ON order_item.product_id = product.id
      GROUP BY "order".id;
    `;

    const { rows } = await this.client.query(query);

    return rows;
  }

  /**
   * Create a new order item in the database.
   * Product and Discounts are dynamically selected from the database.
   * @param entity - An OrderItemModel entity without a product or discounts.
   */
  async createOrderItem(entity: OrderItemModel): Promise<OrderItemModel> {
    try {
      const query = `INSERT INTO ${TABLE_NAME.ORDER_ITEM} (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING product_id, order_id`;
      const values = [entity.product_id, entity.order_id, entity.quantity];

      const result = await this.client.query(query, values);

      if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].product_id || !result.rows[0].order_id) {
        throw new Error('Order item not created.');
      }

      return await this.findOrderItemByProductId({
        order_id: result.rows[0].order_id,
        product_id: result.rows[0].product_id,
      });
    } catch (error) {
      console.log('error', error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findOrderItemsByOrderId({ order_id }: { order_id: string }): Promise<OrderItemModel[]> {
    const query = `SELECT * FROM ${TABLE_NAME.ORDER_ITEM} WHERE order_id = $1`;
    const values = [order_id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order items not found');

    return rows;
  }

  async findOrderItemByProductId({
    order_id,
    product_id,
  }: {
    order_id: string;
    product_id: string;
  }): Promise<OrderItemModel> {
    const query = `SELECT * FROM ${TABLE_NAME.ORDER_ITEM} WHERE order_id = $1 AND product_id = $2`;
    const values = [order_id, product_id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return rows[0];
  }

  async updateOrderItem(entity: OrderItemModel): Promise<OrderItemModel> {
    const query = `
        UPDATE ${TABLE_NAME.ORDER_ITEM}
          SET QUANTITY = $1
        WHERE ORDER_ID = $2 AND PRODUCT_ID = $3;
    `;

    const values = [entity.quantity, entity.order_id, entity.product_id];

    await this.client.query(query, values);
    return await this.findOrderItemByProductId({
      order_id: entity.order_id,
      product_id: entity.product_id,
    });
  }

  async deleteOrderItem(order_id: string, product_id: string): Promise<void> {
    const query = `
      DELETE FROM ${TABLE_NAME.ORDER_ITEM}
      WHERE ORDER_ID = $1 AND PRODUCT_ID = $2;
    `;

    const values = [order_id, product_id];

    await this.client.query(query, values);
  }
}
