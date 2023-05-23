import { Order } from '../types/Entity/Order.types';
import { OrderItemModel } from '../types/Model';
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

export class OrderRepository extends BaseRepository<Order> {
  async create(): Promise<Order> {
    const result = await safe_query(this.client)(INSERT_ORDER);

    if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].id) throw new Error('Order not created');

    return await this.findById(result.rows[0].id);
  }

  update(entity: Order): Promise<Order> {
    throw new Error('Orders cannot currently be updated. Add, update and remove items individually.');
  }

  async delete(id: string | string[]): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_ORDER, values);
  }

  async findById(id: string): Promise<Order> {
    const values = [id];
    const { rows } = await safe_query(this.client)<Order>(FIND_ORDER_BY_ID, values);

    if (rows.length < 1) throw new Error('Order not found');

    return rows[0];
  }

  async findAll(): Promise<Order[]> {
    const { rows } = await this.client.query<Order>(FIND_ALL_ORDERS);
    return rows;
  }

  /**
   * Create a new order item in the database.
   * Product and Discounts are dynamically selected from the database.
   * @param entity - An OrderItemModel entity without a product or discounts.
   */
  async createOrderItem(entity: OrderItemModel): Promise<OrderItemModel> {
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

  async findOrderItemsByOrderId({ order_id }: { order_id: string }): Promise<OrderItemModel[]> {
    const values = [order_id];

    const { rows } = await this.client.query(FIND_ORDER_ITEM_BY_ORDER_ID, values);
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
    const values = [order_id, product_id];

    const { rows } = await this.client.query(FIND_ORDER_ITEM_BY_ORDER_ID_AND_PRODUCT_ID, values);

    if (rows.length < 1) throw new Error('Order item not found');

    return rows[0];
  }

  async updateOrderItem(entity: OrderItemModel): Promise<OrderItemModel> {
    const values = [entity.quantity, entity.order_id, entity.product_id];

    await this.client.query(UPDATE_ORDER_ITEM, values);
    return await this.findOrderItemByProductId({
      order_id: entity.order_id,
      product_id: entity.product_id,
    });
  }

  async deleteOrderItem(order_id: string, product_id: string): Promise<void> {
    const values = [order_id, product_id];

    await this.client.query(DELETE_ORDER_ITEM, values);
  }
}
