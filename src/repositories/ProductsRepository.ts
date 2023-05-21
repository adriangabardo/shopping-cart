import { TABLE_NAME } from '../types';
import { BaseRepository } from './BaseRepository';
import { isDatabaseError } from '../util/database';
import { Product } from '../types/Entity';

export class ProductsRepository extends BaseRepository<Product> {
  protected TABLE_NAME = TABLE_NAME.PRODUCTS;

  async create(entity: Product): Promise<Product> {
    try {
      const query = `INSERT INTO ${this.TABLE_NAME} (id, name, price, inventory) VALUES ($1, $2, $3, $4)`;

      const values = [entity.id, entity.name, entity.price, entity.inventory];
      return await this.client.query(query, values).then(() => this.findById(entity.id));
    } catch (error) {
      console.log(error);
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  }

  async update(entity: Product): Promise<Product> {
    try {
      const query = `UPDATE ${this.TABLE_NAME} SET name = $1, price = $2, inventory = $3 WHERE id = $4`;
      const values = [entity.name, entity.price, entity.inventory, entity.id];
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

  async findById(id: string): Promise<Product> {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
    const values = [id];

    const { rows } = await this.client.query(query, values);

    if (rows.length < 1) throw new Error('Product not found');

    return {
      id: rows[0].id,
      inventory: rows[0].inventory,
      name: rows[0].name,
      price: rows[0].price,
    };
  }

  async findAll(): Promise<Product[]> {
    const query = `SELECT * FROM ${this.TABLE_NAME}`;

    const { rows } = await this.client.query(query);
    return rows.map<Product>((row) => ({ id: row.id, inventory: row.inventory, name: row.name, price: row.price }));
  }
}
