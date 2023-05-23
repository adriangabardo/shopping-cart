import { Discount } from '../types/Entity';
import { RestrictionModel } from '../types/Model';
import { BaseRepository } from './BaseRepository';
import { safe_query } from '../util/database';

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
    const values = [entity.discount_type, entity.amount, entity.explanation];
    const result = await safe_query(this.client)(INSERT_DISCOUNT, values);

    if (!result || !result.rows || result.rows.length < 1) throw new Error('Discount not created');

    return await this.findById(result.rows[0].id);
  }

  async update(entity: Discount): Promise<Discount> {
    const values = [entity.discount_type, entity.amount, entity.explanation, entity.id];
    return await safe_query(this.client)(UPDATE_DISCOUNT, values).then(() => this.findById(entity.id));
  }

  async delete(id: string): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_DISCOUNT, values);
  }

  async findById(id: string): Promise<Discount> {
    const values = [id];

    const { rows } = await safe_query(this.client)<Discount>(FIND_DISCOUNT_BY_ID, values);

    if (rows.length < 1) throw new Error('Discount not found');

    return rows[0];
  }

  async findAll(): Promise<Discount[]> {
    const { rows } = await safe_query(this.client)<Discount>(FIND_ALL_DISCOUNTS);
    return rows;
  }

  async createRestriction(entity: RestrictionModel): Promise<RestrictionModel> {
    const values = [entity.product_id, entity.discount_id, JSON.stringify(entity.range).replace('null', 'NULL')];
    const result = await safe_query(this.client)(INSERT_RESTRICTION, values);

    if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].id) {
      throw new Error('Restriction not created');
    }

    return await this.findRestrictionById(result.rows[0].id);
  }

  async findRestrictionById(restrictionId: string): Promise<RestrictionModel> {
    const values = [restrictionId];
    const { rows } = await safe_query(this.client)<RestrictionModel>(FIND_RESTRICTION_BY_ID, values);

    if (rows.length < 1) throw new Error('Restriction not found');

    return rows[0];
  }

  async findRestrictionsByDiscountId(discountId: string): Promise<RestrictionModel[]> {
    const values = [discountId];

    const { rows } = await safe_query(this.client)<RestrictionModel>(FIND_RESTRICTION_BY_DISCOUNT_ID, values);

    return rows;
  }

  async updateRestriction(entity: RestrictionModel): Promise<RestrictionModel> {
    const values = [
      entity.product_id,
      entity.discount_id,
      JSON.stringify(entity.range).replace('null', 'NULL'),
      entity.id,
    ];

    await safe_query(this.client)(UPDATE_RESTRICTION, values);
    return await this.findRestrictionById(entity.id);
  }

  async deleteRestriction(restrictionId: string): Promise<void> {
    const values = [restrictionId];
    await safe_query(this.client)(DELETE_RESTRICTION, values);
  }
}
