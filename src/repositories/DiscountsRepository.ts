import { Discount } from '../types/Entity';
import { TABLE_NAME } from '../types';
import { isDatabaseError } from '../util/database';
import { BaseRepository } from './BaseRepository';
import { RestrictionModel } from '@/types/Model';

export class DiscountsRepository extends BaseRepository<Discount> {
  protected TABLE_NAME = TABLE_NAME.DISCOUNTS;

  async create(entity: Omit<Discount, 'id'>): Promise<Discount> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} (discount_type, amount, explanation) VALUES ($1, $2, $3) RETURNING id`;
      const values = [entity.discount_type, entity.amount, entity.explanation];
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
      const values = [entity.discount_type, entity.amount, entity.explanation, entity.id];
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
    const query = `
      SELECT discount.*,
        (
          SELECT json_agg(json_build_object(
              'id', restriction.id,
              'discountId', restriction.discount_id,
              'productId', restriction.product_id,
              'range', restriction.range
          ))
          FROM ${TABLE_NAME.RESTRICTIONS} restriction
          WHERE restriction.discount_id = discount.id
        ) AS restrictions
      FROM ${this.TABLE_NAME} discount
      WHERE discount.id = $1;
    `;
    const values = [id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Discount not found');

    return {
      id: rows[0].id,
      discount_type: rows[0].discount_type,
      amount: rows[0].amount,
      explanation: rows[0].explanation,
      restrictions: rows[0].restrictions,
    };
  }

  async findAll(): Promise<Discount[]> {
    const query = `
      SELECT discount.*,
        (
          SELECT json_agg(json_build_object(
              'id', restriction.id,
              'discountId', restriction.discount_id,
              'productId', restriction.product_id,
              'productName', product.name,
              'range', restriction.range
          ))
          FROM ${TABLE_NAME.RESTRICTIONS} restriction
          JOIN PRODUCTS product ON restriction.product_id = product.id
          WHERE restriction.discount_id = discount.id
        ) AS restrictions
      FROM ${this.TABLE_NAME} discount;
    `;

    const { rows } = await this.client.query(query);
    return rows.map<Discount>((row) => ({
      id: row.id,
      discount_type: row.discount_type,
      amount: row.amount,
      explanation: row.explanation,
      restrictions: row.restrictions,
    }));
  }

  async createRestriction(entity: RestrictionModel): Promise<RestrictionModel> {
    try {
      const query = `INSERT INTO ${TABLE_NAME.RESTRICTIONS} (product_id, discount_id, range) VALUES ($1, $2, $3) RETURNING id`;
      const values = [entity.product_id, entity.discount_id, JSON.stringify(entity.range).replace('null', 'NULL')];
      const result = await this.client.query(query, values);

      if (!result || !result.rows || result.rows.length < 1) throw new Error('Restriction not created');

      return this.findRestrictionById(result.rows[0].id);
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findRestrictionById(restrictionId: string): Promise<RestrictionModel> {
    const query = `SELECT * FROM ${TABLE_NAME.RESTRICTIONS} WHERE id = $1`;
    const values = [restrictionId];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Restriction not found');

    return rows[0];
  }

  async findRestrictionsByDiscountId(discountId: string): Promise<RestrictionModel[]> {
    const query = `SELECT * FROM ${TABLE_NAME.RESTRICTIONS} WHERE discount_id = $1`;
    const values = [discountId];

    const { rows } = await this.client.query(query, values);

    return rows;
  }

  async updateRestriction(entity: RestrictionModel): Promise<RestrictionModel> {
    try {
      const query = `UPDATE ${this.TABLE_NAME} SET product_id = $1, discount_id = $2, range = $3 WHERE id = $4`;
      const values = [
        entity.product_id,
        entity.discount_id,
        JSON.stringify(entity.range).replace('null', 'NULL'),
        entity.id,
      ];

      await this.client.query(query, values);
      return await this.findRestrictionById(entity.id);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async deleteRestriction(restrictionId: string): Promise<void> {
    try {
      const query = `DELETE FROM ${TABLE_NAME.RESTRICTIONS} WHERE id = $1`;
      const values = [restrictionId];
      await this.client.query(query, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }
}
