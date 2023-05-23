import { Client, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { is_database_error } from './is_database_error';

/**
 * A wrapper around `client.query` that handles database errors.
 * If a database error is thrown, the error message is extracted from the error and thrown instead.
 * @param client A @see PoolClient and @see Client
 */
export const safe_query =
  (client: PoolClient & Client) =>
  async <T extends QueryResultRow>(
    query: string | QueryConfig<unknown[]>,
    values?: unknown[] | undefined
  ): Promise<QueryResult<T>> => {
    try {
      return await client.query<T>(query, values);
    } catch (error) {
      if (is_database_error(error)) throw new Error(error.detail);
      else throw error;
    }
  };
