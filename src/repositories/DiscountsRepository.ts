import { DiscountModel, RestrictionModel } from '../types/Model';
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

export class DiscountsRepository extends BaseRepository<DiscountModel> {
  /**
   * Create a new discount.
   * @param entity The discount to create, ID is auto-generated so not required.
   * @returns The newly created discount.
   */
  async create(entity: Omit<DiscountModel, 'id'>): Promise<DiscountModel> {
    const values = [entity.discount_type, entity.amount, entity.explanation];
    const result = await safe_query(this.client)(INSERT_DISCOUNT, values);

    if (!result || !result.rows || result.rows.length < 1) throw new Error('Discount not created');

    return await this.findById(result.rows[0].id);
  }

  /**
   * Update an existing discount.
   * @param entity The discount to update.
   * @returns The updated discount.
   */
  async update(entity: DiscountModel): Promise<DiscountModel> {
    const values = [entity.discount_type, entity.amount, entity.explanation, entity.id];
    return await safe_query(this.client)(UPDATE_DISCOUNT, values).then(() => this.findById(entity.id));
  }

  /**
   * Delete a discount by its ID.
   * @param id The ID of the discount.
   */
  async delete(id: string): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_DISCOUNT, values);
  }

  /**
   * Find a discount by its ID.
   * @param id The ID of the discount.
   * @returns The discount if found.
   */
  async findById(id: string): Promise<DiscountModel> {
    const values = [id];

    const { rows } = await safe_query(this.client)<DiscountModel>(FIND_DISCOUNT_BY_ID, values);

    if (rows.length < 1) throw new Error('Discount not found');

    return rows[0];
  }

  /**
   * Find all discounts.
   * @returns All discounts.
   */
  async findAll(): Promise<DiscountModel[]> {
    const { rows } = await safe_query(this.client)<DiscountModel>(FIND_ALL_DISCOUNTS);
    return rows;
  }

  /**
   * Create a new restriction.
   * @param entity The restriction to create, ID is auto-generated so not required.
   * @returns The newly created restriction.
   */
  async createRestriction(entity: Omit<RestrictionModel, 'id'>): Promise<RestrictionModel> {
    const values = [entity.product_id, entity.discount_id, JSON.stringify(entity.range).replace('null', 'NULL')];
    const result = await safe_query(this.client)(INSERT_RESTRICTION, values);

    if (!result || !result.rows || result.rows.length < 1 || !result.rows[0].id) {
      throw new Error('Restriction not created');
    }

    return await this.findRestrictionById(result.rows[0].id);
  }

  /**
   * Find a restriction by its ID.
   * @param restrictionId The ID of the restriction.
   * @returns The restriction if found.
   */
  async findRestrictionById(restrictionId: string): Promise<RestrictionModel> {
    const values = [restrictionId];
    const { rows } = await safe_query(this.client)<RestrictionModel>(FIND_RESTRICTION_BY_ID, values);

    if (rows.length < 1) throw new Error('Restriction not found');

    return rows[0];
  }

  /**
   * Find all restrictions for a discount.
   * @param discountId The ID of the discount.
   * @returns All restrictions for the discount.
   */
  async findRestrictionsByDiscountId(discountId: string): Promise<RestrictionModel[]> {
    const values = [discountId];

    const { rows } = await safe_query(this.client)<RestrictionModel>(FIND_RESTRICTION_BY_DISCOUNT_ID, values);

    return rows;
  }

  /**
   * Update an existing restriction.
   * @param entity The restriction to update.
   * @returns The updated restriction.
   */
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

  /**
   * Delete a restriction by its ID.
   * @param restrictionId The ID of the restriction.
   * @returns The deleted restriction.
   */
  async deleteRestriction(restrictionId: string): Promise<void> {
    const values = [restrictionId];
    await safe_query(this.client)(DELETE_RESTRICTION, values);
  }
}
