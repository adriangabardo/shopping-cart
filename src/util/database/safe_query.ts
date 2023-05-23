import { Client, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { isDatabaseError } from './isDatabaseError';

export const safe_query =
  (client: PoolClient & Client) =>
  async <T extends QueryResultRow>(
    query: string | QueryConfig<unknown[]>,
    values?: unknown[] | undefined
  ): Promise<QueryResult<T>> => {
    try {
      return await client.query<T>(query, values);
    } catch (error) {
      if (isDatabaseError(error)) throw new Error(error.detail);
      else throw error;
    }
  };
