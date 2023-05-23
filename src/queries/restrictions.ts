import { TABLE_NAME } from '../types';

export const INSERT_RESTRICTION = `INSERT INTO ${TABLE_NAME.RESTRICTIONS} (product_id, discount_id, range) VALUES ($1, $2, $3) RETURNING id`;
export const UPDATE_RESTRICTION = `UPDATE ${TABLE_NAME.RESTRICTIONS} SET product_id = $1, discount_id = $2, range = $3 WHERE id = $4`;
export const DELETE_RESTRICTION = `DELETE FROM ${TABLE_NAME.RESTRICTIONS} WHERE id = $1`;

export const FIND_RESTRICTION_BY_ID = `SELECT * FROM ${TABLE_NAME.RESTRICTIONS} WHERE id = $1`;

/**
 * This query finds all restrictions which discount_id matches the discount's ID.
 */
export const FIND_RESTRICTION_BY_DISCOUNT_ID = `SELECT * FROM ${TABLE_NAME.RESTRICTIONS} WHERE discount_id = $1`;
