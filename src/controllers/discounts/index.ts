import { Request, Response } from 'express';
import { DiscountsRepository } from '../../repositories';
import { pool } from '../../util/database';

export const discountsGet = async (req: Request, res: Response) => {
  const client = await pool.connect();

  const discountsRepository = new DiscountsRepository(client);
  const discounts = await discountsRepository.findAll();

  client.release();

  res.send(discounts);
};
