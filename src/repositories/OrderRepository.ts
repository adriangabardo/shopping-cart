import { Order } from '@/types/Entity/Order.types';
import { BaseRepository } from './BaseRepository';
import { TABLE_NAME } from '@/types';
import { isDatabaseError } from '@/util/database';

export class OrderRepository extends BaseRepository<Order> {
  protected TABLE_NAME: TABLE_NAME = TABLE_NAME.ORDERS;

  async create(): Promise<Order> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} DEFAULT VALUES RETURNING id`;

      return await this.client.query(query).then((result) => {
        if (!result || !result.rows || result.rows.length < 1) throw new Error('Order not created');
        return this.findById(result.rows[0].id);
      });
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  update(entity: Order): Promise<Order> {
    throw new Error('Orders cannot be updated.');
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

  async findById(id: string | string[]): Promise<Order> {
    const query = `
        SELECT
            o.id AS order_id,
            json_agg(json_build_object(
                'productId', order_item.product_id,
                'orderId', order_item.order_id,
                'product', json_build_object('name', product.name, 'price', product.price),
                'quantity', order_item.quantity,
                'discounts', (
                    SELECT json_agg(json_build_object(
                        'id', discount.id,
                        'discountType', discount.discount_type,
                        'amount', discount.amount,
                        'explanation', discount.explanation
                    ))
                FROM ${TABLE_NAME.DISCOUNTS} discount
                JOIN ${TABLE_NAME.RESTRICTIONS} restriction ON discount.id = restriction.discount_id
                WHERE restriction.product_id = order_item.product_id
                    AND (lower(restriction.range) <= CAST(order_item.quantity AS numeric) 
                    OR restriction.range IS NULL)
                )
            )) AS "items",
            SUM(product.price * order_item.quantity) AS "total"
        FROM ${this.TABLE_NAME} o
        JOIN ${TABLE_NAME.ORDER_ITEM} order_item ON o.id = order_item.order_id
        JOIN ${TABLE_NAME.PRODUCTS} product ON order_item.product_id = product.id
        WHERE o.id = $1
        GROUP BY o.id;
    `;

    const values = [id];
    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Order not found');

    return {
      id: rows[0].order_id,
      items: rows[0].items,
      total: rows[0].total,
    };
  }

  async findAll(): Promise<Order[]> {
    const query = `
        SELECT
            o.id AS order_id,
            json_agg(json_build_object(
                'productId', order_item.product_id,
                'orderId', order_item.order_id,
                'product', json_build_object('name', product.name, 'price', product.price),
                'quantity', order_item.quantity,
                'discounts', (
                    SELECT json_agg(json_build_object(
                        'id', discount.id,
                        'discountType', discount.discount_type,
                        'amount', discount.amount,
                        'explanation', discount.explanation
                    ))
                FROM ${TABLE_NAME.DISCOUNTS} discount
                JOIN ${TABLE_NAME.RESTRICTIONS} restriction ON discount.id = restriction.discount_id
                WHERE restriction.product_id = order_item.product_id
                    AND (lower(restriction.range) <= CAST(order_item.quantity AS numeric) 
                    OR restriction.range IS NULL)
                )
            )) AS "items",
            SUM(product.price * order_item.quantity) AS "total"
        FROM ${this.TABLE_NAME} o
        JOIN ${TABLE_NAME.ORDER_ITEM} order_item ON o.id = order_item.order_id
        JOIN ${TABLE_NAME.PRODUCTS} product ON order_item.product_id = product.id
        GROUP BY o.id;
    `;

    const { rows } = await this.client.query(query);

    return rows.map<Order>((row) => ({
      id: row.order_id,
      items: row.items,
      total: row.total,
    }));
  }
}
