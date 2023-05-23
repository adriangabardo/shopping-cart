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
   */
  abstract create(entity: E | Omit<E, 'id'>): Promise<E>;
  abstract update(entity: E): Promise<E>;
  abstract delete(id: string | CompositePK): Promise<void>;
  abstract findById(id: string | CompositePK): Promise<E>;
  abstract findAll(): Promise<E[]>;
}
