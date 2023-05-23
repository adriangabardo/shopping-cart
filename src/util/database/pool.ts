import Pool from 'pg-pool';
import { extract_environment_variables } from '../extract_env_vars';

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } = extract_environment_variables(
  { throwOnError: true },
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_DATABASE'
);

/**
 * A singleton instance of @see Pool.
 * Initialized with default values from environment variables.
 */
export const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  ssl: false,
});
