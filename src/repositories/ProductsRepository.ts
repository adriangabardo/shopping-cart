import { Product } from '../types/Entity';
import { isDatabaseError } from '../util/database';
import { BaseRepository } from './BaseRepository';

import {
  DELETE_PRODUCT,
  FIND_ALL_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  INSERT_PRODUCT,
  UPDATE_PRODUCT,
} from '../queries/products';

export class ProductsRepository extends BaseRepository<Product> {
  async create(entity: Product): Promise<Product> {
    try {
      const values = [entity.id, entity.name, entity.price, entity.inventory];
      await this.client.query(INSERT_PRODUCT, values);
      return await this.findById(entity.id);
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async update(entity: Product): Promise<Product> {
    try {
      const values = [entity.name, entity.price, entity.inventory, entity.id];
      await this.client.query(UPDATE_PRODUCT, values);
      return await this.findById(entity.id);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const values = [id];
      await this.client.query(DELETE_PRODUCT, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async findById(id: string): Promise<Product> {
    const values = [id];

    const { rows } = await this.client.query(FIND_PRODUCT_BY_ID, values);
    if (rows.length < 1) throw new Error('Product not found');

    return {
      id: rows[0].id,
      inventory: rows[0].inventory,
      name: rows[0].name,
      price: rows[0].price,
    };
  }

  async findAll(): Promise<Product[]> {
    const { rows } = await this.client.query(FIND_ALL_PRODUCTS);
    return rows.map<Product>((row) => ({ id: row.id, inventory: row.inventory, name: row.name, price: row.price }));
  }
}
