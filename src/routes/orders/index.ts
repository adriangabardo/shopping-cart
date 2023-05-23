import express from 'express';

import { orderAddItems, ordersCheckout, ordersCreate, ordersGet, ordersGetByID } from '../../controllers';

const orders_router = express.Router();

orders_router.get('/', ordersGet);
orders_router.post('/', ordersCreate);
orders_router.get('/:id', ordersGetByID);
orders_router.post('/:id/add', orderAddItems);
orders_router.post('/:id/checkout', ordersCheckout);

/**
 * ADRIAN NOTES:
 * Can easily extended the routes here to include:
 * - Removing an item from an order
 * - Editing an item in an order
 * - Deleting an order
 */

export { orders_router };
