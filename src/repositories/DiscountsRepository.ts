import { Discount } from '../types/Entity';
import { RestrictionModel } from '../types/Model';
import { isDatabaseError } from '../util/database';
import { BaseRepository } from './BaseRepository';

import {
  DELETE_DISCOUNT,
  FIND_ALL_DISCOUNTS,
  FIND_DISCOUNT_BY_ID,
  INSERT_DISCOUNT,
  UPDATE_DISCOUNT,
} from '../queries/discounts';

import {
  DELETE_RESTRICTION,
  FIND_RESTRICTION_BY_DISCOUNT_ID,
  FIND_RESTRICTION_BY_ID,
  INSERT_RESTRICTION,
  UPDATE_RESTRICTION,
} from '../queries/restrictions';

export class DiscountsRepository extends BaseRepository<Discount> {
  async create(entity: Omit<Discount, 'id'>): Promise<Discount> {
    try {
      const values = [entity.discount_type, entity.amount, entity.explanation];
      return await this.client.query(INSERT_DISCOUNT, values).then((result) => {
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
      const values = [entity.discount_type, entity.amount, entity.explanation, entity.id];
      return await this.client.query(UPDATE_DISCOUNT, values).then(() => this.findById(entity.id));
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const values = [id];
      await this.client.query(DELETE_DISCOUNT, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findById(id: string): Promise<Discount> {
    const values = [id];

    const { rows } = await this.client.query(FIND_DISCOUNT_BY_ID, values);

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
    const { rows } = await this.client.query(FIND_ALL_DISCOUNTS);
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
      const values = [entity.product_id, entity.discount_id, JSON.stringify(entity.range).replace('null', 'NULL')];
      const result = await this.client.query(INSERT_RESTRICTION, values);

      if (!result || !result.rows || result.rows.length < 1) throw new Error('Restriction not created');

      return this.findRestrictionById(result.rows[0].id);
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findRestrictionById(restrictionId: string): Promise<RestrictionModel> {
    const values = [restrictionId];

    const { rows } = await this.client.query(FIND_RESTRICTION_BY_ID, values);

    if (rows.length < 1) throw new Error('Restriction not found');

    return rows[0];
  }

  async findRestrictionsByDiscountId(discountId: string): Promise<RestrictionModel[]> {
    const values = [discountId];

    const { rows } = await this.client.query(FIND_RESTRICTION_BY_DISCOUNT_ID, values);

    return rows;
  }

  async updateRestriction(entity: RestrictionModel): Promise<RestrictionModel> {
    try {
      const values = [
        entity.product_id,
        entity.discount_id,
        JSON.stringify(entity.range).replace('null', 'NULL'),
        entity.id,
      ];

      await this.client.query(UPDATE_RESTRICTION, values);
      return await this.findRestrictionById(entity.id);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async deleteRestriction(restrictionId: string): Promise<void> {
    try {
      const values = [restrictionId];
      await this.client.query(DELETE_RESTRICTION, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }
}
