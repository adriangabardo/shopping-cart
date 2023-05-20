// Make sure to import 'dotenv/config' before anything else
import * as dotenv from 'dotenv';
dotenv.config();

import { pool } from '@/util/database';
import { ProductsRepository } from './repositories/ProductsRepository';
import { DiscountsRepository } from './repositories/DiscountsRepository';
import { OrderItemRepository, OrderRepository, RestrictionsRepository } from './repositories';

(async () => {
  const client = await pool.connect();

  const orderRepository = new OrderRepository(client);

  // const orders = await orderRepository.findAll();
  // console.log('Repository result:', orders);

  const order = await orderRepository.findById('579fa14b-263e-4bef-b695-15a98d5a940c');
  console.log('Repository result:', order);

  client.release();

  pool.end();
})();
