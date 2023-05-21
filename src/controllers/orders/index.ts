import { Request, Response } from 'express';

import { OrderRepository } from '../../repositories';
import { pool } from '../../util/database';
import { calculate_total_cost } from '../../util/total_cost';
import { uniqueDiscounts } from '../../util/unique_discounts';

export const ordersGet = async (_req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findAll()
    .then((orders) => res.send(orders))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Failed to retrieve orders.');
    })
    .finally(() => client.release());
};

export const ordersGetByID = async (req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findById(req.params.id)
    .then((order) => res.send(order))
    .catch(() => res.status(500).send('Failed to retrieve order.'))
    .finally(() => client.release());
};

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
        items.map((item: { product_id: string; quantity: number }) =>
          orderRepository.createOrderItem({
            order_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
          })
        )
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

export const ordersCheckout = async (req: Request, res: Response) => {
  const client = await pool.connect();

  await new OrderRepository(client)
    .findById(req.params.id)
    .then((order) => {
      const finalCost = calculate_total_cost(order, uniqueDiscounts(order));
      res.send({ ...order, finalCost });
    })
    .catch(() => res.status(500).send('Failed to checkout order.'))
    .finally(() => client.release());
};
