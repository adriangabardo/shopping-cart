import { Request, Response } from 'express';

import { DiscountsRepository, OrderRepository } from '../../repositories';
import { pool } from '../../util/database';
import { calculate_cart_total } from '../../util/calculate_cart_total';
import { validate_discounts } from '../../util/validate_discounts';

/**
 * Receive a request to get all orders.
 * Responds with all orders.
 */
export const ordersGet = async (_req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findAll()
    .then((orders) => res.send(orders))
    .catch(() => res.status(500).send('Failed to retrieve orders.'))
    .finally(() => client.release());
};

/**
 * Receive a request to get a single order.
 * Responds with the order.
 */
export const ordersGetByID = async (req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findById(req.params.id)
    .then((order) => res.send(order))
    .catch(() => res.status(500).send('Failed to retrieve order.'))
    .finally(() => client.release());
};

/**
 * Receive a request to get all items for a single order.
 * Responds with the order items.
 */
export const orderItemsGetByID = async (req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findOrderItemByProductId({
      product_id: req.params.productId,
      order_id: req.params.id,
    })
    .then((order) => res.send(order))
    .catch(() => res.status(500).send('Failed to get order item.'))
    .finally(() => client.release());
};

/**
 * Receive a request to create an order.
 * Responds with the created order.
 */
export const ordersCreate = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    // Create an order
    const orderRepository = new OrderRepository(client);
    const { id } = await orderRepository.create();

    // If items array is passed through, create order items
    if (req.body.items) {
      const { items } = req.body;
      await Promise.all(
        items.map(async (item: { product_id: string; quantity: number }) => {
          return orderRepository.createOrderItem({
            order_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
          });
        })
      );
    }

    // Re-fetch order to get populated items
    const order = await orderRepository.findById(id);
    res.send(order);
  } catch (error) {
    console.log('error', error);
    res.status(500).send('Failed to create order.');
  } finally {
    client.release();
  }
};

/**
 * Receive a request to add items to an order.
 * Responds with the updated order.
 */
export const orderAddItems = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const orderRepository = new OrderRepository(client);
    const { items } = req.body;

    // Add items to order
    await Promise.all(
      items.map(async (item: { product_id: string; quantity: number }) => {
        await orderRepository.createOrderItem({
          order_id: req.params.id,
          product_id: item.product_id,
          quantity: item.quantity,
        });
      })
    );

    // Re-fetch order to get populated items
    const order = await orderRepository.findById(req.params.id);
    res.send(order);
  } catch (error) {
    console.log('error', error);
    res.status(500).send('Failed to add items to order.');
  } finally {
    client.release();
  }
};

/**
 * Receive a request to checkout an order.
 * Responds with the order, and the calculated final price including discounts.
 */
export const ordersCheckout = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const orderRepository = new OrderRepository(client);
    const order = await orderRepository.findById(req.params.id);

    const discountsRepository = new DiscountsRepository(client);

    // Grab all discounts, later can be filtered down to find by order products' id.
    const discounts = await discountsRepository.findAll();

    // Evaluate which discounts apply to this order
    const applicable_discounts = validate_discounts(order, discounts);

    // Calculate total cost
    const { discountedTotal, total } = calculate_cart_total(order, applicable_discounts);

    res.send({
      ...order,
      discountedTotal: discountedTotal.toFixed(2),
      total: total.toFixed(2),
      applicableDiscounts: applicable_discounts,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).send('Failed to checkout order.');
  } finally {
    client.release();
  }
};
