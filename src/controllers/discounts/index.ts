import { Request, Response } from 'express';
import { DiscountsRepository } from '../../repositories';
import { pool } from '../../util/database';

/**
 * Receive a request to get all discounts.
 * Responds with all discounts.
 */
export const discountsGet = async (req: Request, res: Response) => {
  const client = await pool.connect();

  const discountsRepository = new DiscountsRepository(client);
  const discounts = await discountsRepository.findAll();

  client.release();

  res.send(discounts);
};

/**
 * ADRIAN NOTES:
 * Can easily extended the controllers here to include:
 * - Getting a single discount
 * - Creating a discount
 * - Editing a discount
 * - Deleting a discount
 * - Getting all restrictions for a discount
 * - Creating a restriction for a discount
 * - Editing a restriction for a discount
 * - Deleting a restriction for a discount
 */
