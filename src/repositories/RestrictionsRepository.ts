import { Restriction, TABLE_NAME } from '@/types';
import { BaseRepository } from './BaseRepository';
import { isDatabaseError } from '@/util/database';

export class RestrictionsRepository extends BaseRepository<Restriction> {
  protected TABLE_NAME = TABLE_NAME.RESTRICTIONS;

  async create(entity: Omit<Restriction, 'id'>): Promise<Restriction> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} (product_id, discount_id, range) VALUES ($1, $2, $3) RETURNING id`;
      const values = [entity.productId, entity.discountId, JSON.stringify(entity.range).replace('null', 'NULL')];
      return await this.client.query(query, values).then((result) => {
        if (!result || !result.rows || result.rows.length < 1) throw new Error('Restriction not created');
        return this.findById(result.rows[0].id);
      });
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async update(entity: Restriction): Promise<Restriction> {
    try {
      const query = `UPDATE ${this.TABLE_NAME} SET product_id = $1, discount_id = $2, range = $3 WHERE id = $4`;
      const values = [
        entity.productId,
        entity.discountId,
        JSON.stringify(entity.range).replace('null', 'NULL'),
        entity.id,
      ];
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

  async findById(id: string): Promise<Restriction> {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
    const values = [id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Restriction not found');

    return {
      id: rows[0].id,
      discountId: rows[0].discount_id,
      productId: rows[0].product_id,
      range: rows[0].range,
    };
  }

  async findAll(): Promise<Restriction[]> {
    const query = `SELECT * FROM ${this.TABLE_NAME}`;

    const { rows } = await this.client.query(query);

    return rows.map<Restriction>((row) => ({
      id: row.id,
      discountId: row.discount_id,
      productId: row.product_id,
      range: row.range,
    }));
  }

  async findByDiscountId(discountId: string): Promise<Restriction[]> {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE discount_id = $1`;
    const values = [discountId];

    const { rows } = await this.client.query(query, values);
    return rows.map<Restriction>((row) => ({
      id: row.id,
      discountId: row.discount_id,
      productId: row.product_id,
      range: row.range,
    }));
  }

  async findByProductId(productId: string): Promise<Restriction[]> {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE product_id = $1`;
    const values = [productId];

    const { rows } = await this.client.query(query, values);
    return rows.map<Restriction>((row) => ({
      id: row.id,
      discountId: row.discount_id,
      productId: row.product_id,
      range: row.range,
    }));
  }
}
