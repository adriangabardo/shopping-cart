import { TABLE_NAME } from '../types';

export const INSERT_ORDER = `INSERT INTO ${TABLE_NAME.ORDERS} DEFAULT VALUES RETURNING id`;
export const DELETE_ORDER = `DELETE FROM ${TABLE_NAME.ORDERS} WHERE id = $1`;

/**
 * This query selects an order from the ORDERS table where the id matches the passed in id.
 * It also does a LEFT JOIN to grab all order items that match the order id.
 * And it does a LEFT JOIN to grab all products that match the product id on order id.
 */
export const FIND_ORDER_BY_ID = `
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
    FROM ${TABLE_NAME.ORDERS} AS "order"
    LEFT JOIN ${TABLE_NAME.ORDER_ITEM} AS order_item ON "order".id = order_item.order_id
    LEFT JOIN ${TABLE_NAME.PRODUCTS} AS product ON order_item.product_id = product.id
    WHERE "order".id = $1
    GROUP BY "order".id;
`;

/**
 * This query selects all orders from the ORDERS table.
 * It also does a LEFT JOIN to grab all order items that match the order id.
 * And it does a LEFT JOIN to grab all products that match the product id on order id.
 */
export const FIND_ALL_ORDERS = `
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
    FROM ${TABLE_NAME.ORDERS} AS "order"
    LEFT JOIN ${TABLE_NAME.ORDER_ITEM} AS order_item ON "order".id = order_item.order_id
    LEFT JOIN ${TABLE_NAME.PRODUCTS} AS product ON order_item.product_id = product.id
    GROUP BY "order".id;
`;
