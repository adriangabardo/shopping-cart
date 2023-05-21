import express from 'express';

import { ordersCheckout, ordersCreate, ordersGet, ordersGetByID } from '../../controllers';

const orders_router = express.Router();

orders_router.get('/', ordersGet);
orders_router.post('/', ordersCreate);
orders_router.get('/:id', ordersGetByID);
// orders_router.get('/:id/items/:productId', orderItemsGetByID);

orders_router.post('/:id/checkout', ordersCheckout);

export { orders_router };
