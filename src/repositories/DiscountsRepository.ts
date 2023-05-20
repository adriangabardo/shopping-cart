import { Discount, TABLE_NAME } from '@/types';
import { BaseRepository } from './BaseRepository';
import { isDatabaseError } from '@/util/database';

export class DiscountsRepository extends BaseRepository<Discount> {
  protected TABLE_NAME = TABLE_NAME.DISCOUNTS;

  async create(entity: Omit<Discount, 'id'>): Promise<Discount> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} (discount_type, amount, explanation) VALUES ($1, $2, $3) RETURNING id`;
      const values = [entity.discountType, entity.amount, entity.explanation];
      return await this.client.query(query, values).then((result) => {
        if (!result || !result.rows || result.rows.length < 1) throw new Error('Discount not created');
        return this.findById(result.rows[0].id);
      });
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async update(entity: Discount): Promise<Discount> {
    try {
      const query = `UPDATE ${this.TABLE_NAME} SET discount_type = $1, amount = $2, explanation = $3 WHERE id = $4`;
      const values = [entity.discountType, entity.amount, entity.explanation, entity.id];
      return await this.client.query(query, values).then(() => this.findById(entity.id));
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
      const values = [id];
      await this.client.query(query, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findById(id: string): Promise<Discount> {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
    const values = [id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Discount not found');

    return {
      id: rows[0].id,
      discountType: rows[0].discount_type,
      amount: rows[0].amount,
      explanation: rows[0].explanation,
    };
  }

  async findAll(): Promise<Discount[]> {
    const query = `SELECT * FROM ${this.TABLE_NAME}`;

    const { rows } = await this.client.query(query);
    return rows.map<Discount>((row) => ({
      id: row.id,
      discountType: row.discount_type,
      amount: row.amount,
      explanation: row.explanation,
    }));
  }
}
