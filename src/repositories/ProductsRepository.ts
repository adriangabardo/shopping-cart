import { Product } from '../types/Entity';
import { BaseRepository } from './BaseRepository';
import { safe_query } from '../util/database';

import {
  DELETE_PRODUCT,
  FIND_ALL_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  INSERT_PRODUCT,
  UPDATE_PRODUCT,
} from '../queries/products';

export class ProductsRepository extends BaseRepository<Product> {
  async create(entity: Product): Promise<Product> {
    const values = [entity.id, entity.name, entity.price, entity.inventory];
    await safe_query(this.client)(INSERT_PRODUCT, values);
    return await this.findById(entity.id);
  }

  async update(entity: Product): Promise<Product> {
    const values = [entity.name, entity.price, entity.inventory, entity.id];
    await safe_query(this.client)(UPDATE_PRODUCT, values);
    return await this.findById(entity.id);
  }

  async delete(id: string): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_PRODUCT, values);
  }

  async findById(id: string): Promise<Product> {
    const values = [id];

    const { rows } = await safe_query(this.client)<Product>(FIND_PRODUCT_BY_ID, values);
    if (rows.length < 1) throw new Error('Product not found');

    return rows[0];
  }

  async findAll(): Promise<Product[]> {
    const { rows } = await safe_query(this.client)<Product>(FIND_ALL_PRODUCTS);
    return rows;
  }
}
