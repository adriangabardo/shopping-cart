import { Client, PoolClient } from 'pg';

type CompositePK = string[];

/**
 * The BaseRepository class is an abstract class that defines the basic CRUD operations
 * that can be performed against a database table to manage an Entity.
 */
export abstract class BaseRepository<E> {
  protected client: Client & PoolClient;

  /**
   * The constructor for the base repository class.
   * @param client - A Postgres client connection.
   */
  constructor(client: Client & PoolClient) {
    this.client = client;
  }

  // CRUD operations to be implemented by the child class
  /**
   * This method creates a new entity in the database.
   * @param entity - Either a full entity or an entity without an id.
   * @returns The newly created entity.
   */
  abstract create(entity: E | Omit<E, 'id'>): Promise<E>;
  /**
   * This method updates an existing entity in the database.
   * @param entity - The entity to update.
   * @returns The updated entity.
   */
  abstract update(entity: E): Promise<E>;
  /**
   * This method deletes an existing entity in the database.
   * @param id - The id of the entity to delete. Can be a composite primary key.
   */
  abstract delete(id: string | CompositePK): Promise<void>;
  /**
   * This method finds an existing entity in the database by its id.
   * @param id - The id of the entity to find. Can be a composite primary key.
   * @returns The entity if found.
   */
  abstract findById(id: string | CompositePK): Promise<E>;
  /**
   * This method finds all entities in the database.
   * @returns All entities in the database.
   */
  abstract findAll(): Promise<E[]>;
}
