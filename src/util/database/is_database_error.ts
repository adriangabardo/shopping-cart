import { DatabaseError } from 'pg';

/**
 * This utility is a type predicate that asserts whether a passed in value is a DatabaseError.
 * @param x - A value of unknown type.
 * @returns A boolean asserting whether the passed in value is a DatabaseError.
 */
export const is_database_error = (x: unknown): x is DatabaseError =>
  !!x && typeof x === 'object' && 'code' in x && 'detail' in x;
