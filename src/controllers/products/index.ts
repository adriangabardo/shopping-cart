import { Request, Response } from 'express';
import { ProductsRepository } from '../../repositories';
import { pool } from '../../util/database';

export const productsGet = async (_req: Request, res: Response) => {
  const client = await pool.connect();

  await new ProductsRepository(client)
    .findAll()
    .then((products) => res.send(products))
    .catch(() => res.status(500).send('Failed to retrieve products.'))
    .finally(() => client.release());
};
