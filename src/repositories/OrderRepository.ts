import { OrderItemModel, OrderModel } from '../types/Model';
import { BaseRepository } from './BaseRepository';
import { safe_query } from '../util/database';

import { DELETE_ORDER, FIND_ALL_ORDERS, FIND_ORDER_BY_ID, INSERT_ORDER } from '../queries/orders';

import {
  DELETE_ORDER_ITEM,
  FIND_ORDER_ITEM_BY_ORDER_ID,
  FIND_ORDER_ITEM_BY_ORDER_ID_AND_PRODUCT_ID,
  INSERT_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
} from '../queries/orderItems';

export class OrderRepository extends BaseRepository<OrderModel> {
  /**
   * Create a new order.
   * Orders are created with default values, therefore no parameters are required.
   * @returns The newly created order.
   */
  async create(): Promise<OrderModel> {
    const result = await safe_query(this.client)(INSERT_ORDER);

    if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].id) throw new Error('Order not created');

    return await this.findById(result.rows[0].id);
  }

  /**
   * Update an order by its ID.
   * Currently, this method throws an error, as orders cannot be updated.
   */
  update(entity: OrderModel): Promise<OrderModel> {
    throw new Error('Orders cannot currently be updated. Add, update and remove items individually.');
  }

  /**
   * Delete an order by its ID.
   * @param id - The ID of the order.
   */
  async delete(id: string): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_ORDER, values);
  }

  /**
   * Find an order by its ID.
   * @param id - The ID of the order.
   * @returns The order if found.
   */
  async findById(id: string): Promise<OrderModel> {
    const values = [id];
    const { rows } = await safe_query(this.client)<OrderModel>(FIND_ORDER_BY_ID, values);

    if (rows.length < 1) throw new Error('Order not found');

    return rows[0];
  }

  /**
   * Find all orders in the database.
   * @returns An array of orders.
   */
  async findAll(): Promise<OrderModel[]> {
    const { rows } = await this.client.query<OrderModel>(FIND_ALL_ORDERS);
    return rows;
  }

  /**
   * Create a new order item in the database.
   * Product and Discounts are dynamically selected from the database.
   * @param entity - An OrderItemModel entity without product_name or product_price.
   */
  async createOrderItem(entity: Omit<OrderItemModel, 'product_name' | 'product_price'>): Promise<OrderItemModel> {
    const values = [entity.product_id, entity.order_id, entity.quantity];
    const result = await this.client.query(INSERT_ORDER_ITEM, values);

    if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].product_id || !result.rows[0].order_id) {
      throw new Error('Order item not created.');
    }

    return await this.findOrderItemByProductId({
      order_id: result.rows[0].order_id,
      product_id: result.rows[0].product_id,
    });
  }

  /**
   * Find all order items for a given order.
   * @param options.order_id - The order ID to find order items for.
   * @returns An array of order items.
   */
  async findOrderItemsByOrderId({ order_id }: { order_id: string }): Promise<OrderItemModel[]> {
    const values = [order_id];

    const { rows } = await this.client.query(FIND_ORDER_ITEM_BY_ORDER_ID, values);
    if (rows.length < 1) throw new Error('Order items not found');

    return rows;
  }

  /**
   * Find a single order item by order ID and product ID.
   * @param options.order_id - The order ID to find order items for.
   * @param options.product_id - The product ID to find order items for.
   * @returns The order item, if found.
   */
  async findOrderItemByProductId({
    order_id,
    product_id,
  }: {
    order_id: string;
    product_id: string;
  }): Promise<OrderItemModel> {
    const values = [order_id, product_id];

    const { rows } = await this.client.query(FIND_ORDER_ITEM_BY_ORDER_ID_AND_PRODUCT_ID, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return rows[0];
  }

  /**
   * Update an order item in the database.
   * @param entity - An OrderItemModel entity with updated values.
   * @returns The updated order item.
   */
  async updateOrderItem(entity: OrderItemModel): Promise<OrderItemModel> {
    const values = [entity.quantity, entity.order_id, entity.product_id];

    await this.client.query(UPDATE_ORDER_ITEM, values);
    return await this.findOrderItemByProductId({
      order_id: entity.order_id,
      product_id: entity.product_id,
    });
  }

  /**
   * Delete an order item from the database.
   * @param options.order_id - The order ID to find order items for.
   * @param options.product_id - The product ID to find order items for.
   */
  async deleteOrderItem({ order_id, product_id }: { order_id: string; product_id: string }): Promise<void> {
    const values = [order_id, product_id];

    await this.client.query(DELETE_ORDER_ITEM, values);
  }
}
