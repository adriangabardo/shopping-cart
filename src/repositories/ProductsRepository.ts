import { BaseRepository } from './BaseRepository';
import { safe_query } from '../util/database';
import { ProductModel } from '../types/Model';

import {
  DELETE_PRODUCT,
  FIND_ALL_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  INSERT_PRODUCT,
  UPDATE_PRODUCT,
} from '../queries/products';

export class ProductsRepository extends BaseRepository<ProductModel> {
  /**
   * Create a new product.
   * @param entity The product to create.
   * @returns The newly created product.
   */
  async create(entity: ProductModel): Promise<ProductModel> {
    const values = [entity.id, entity.name, entity.price, entity.inventory];
    await safe_query(this.client)(INSERT_PRODUCT, values);
    return await this.findById(entity.id);
  }

  /**
   * Update an existing product.
   * @param entity The product to update.
   * @returns The updated product.
   */
  async update(entity: ProductModel): Promise<ProductModel> {
    const values = [entity.name, entity.price, entity.inventory, entity.id];
    await safe_query(this.client)(UPDATE_PRODUCT, values);
    return await this.findById(entity.id);
  }

  /**
   * Delete a product by its ID.
   * @param id The ID of the product.
   */
  async delete(id: string): Promise<void> {
    const values = [id];
    await safe_query(this.client)(DELETE_PRODUCT, values);
  }

  /**
   * Find a product by its ID.
   * @param id The ID of the product.
   * @returns The product if found.
   */
  async findById(id: string): Promise<ProductModel> {
    const values = [id];

    const { rows } = await safe_query(this.client)<ProductModel>(FIND_PRODUCT_BY_ID, values);
    if (rows.length < 1) throw new Error('Product not found');

    return rows[0];
  }

  /**
   * Find all products.
   * @returns All products.
   */
  async findAll(): Promise<ProductModel[]> {
    const { rows } = await safe_query(this.client)<ProductModel>(FIND_ALL_PRODUCTS);
    return rows;
  }
}
