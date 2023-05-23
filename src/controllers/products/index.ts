import { Request, Response } from 'express';
import { ProductsRepository } from '../../repositories';
import { pool } from '../../util/database';

/**
 * Receive a request to get all products.
 * Responds with all products.
 */
export const productsGet = async (_req: Request, res: Response) => {
  const client = await pool.connect();

  await new ProductsRepository(client)
    .findAll()
    .then((products) => res.send(products))
    .catch(() => res.status(500).send('Failed to retrieve products.'))
    .finally(() => client.release());
};

/**
 * ADRIAN NOTES:
 * Can easily extended the controllers here to include:
 * - Getting a single product
 * - Creating a product
 * - Editing a product
 * - Deleting a product
 */
