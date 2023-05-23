import { TABLE_NAME } from '../types';

export const INSERT_PRODUCT = `INSERT INTO ${TABLE_NAME.PRODUCTS} (id, name, price, inventory) VALUES ($1, $2, $3, $4)`;
export const UPDATE_PRODUCT = `UPDATE ${TABLE_NAME.PRODUCTS} SET name = $1, price = $2, inventory = $3 WHERE id = $4`;
export const DELETE_PRODUCT = `DELETE FROM ${TABLE_NAME.PRODUCTS} WHERE id = $1`;
export const FIND_PRODUCT_BY_ID = `SELECT * FROM ${TABLE_NAME.PRODUCTS} WHERE id = $1`;
export const FIND_ALL_PRODUCTS = `SELECT * FROM ${TABLE_NAME.PRODUCTS}`;
