/**
 * Parse a SQL NUMRANGE string into a tuple of numbers.
 * @param numRangeString - Expected format: [1, 3) or (1, 3] or (1, 3) or [1, 3].
 * @returns
 */
export const parse_num_range = (numRangeString: string): number[] => {
  // Remove the surrounding brackets and split the string by comma
  const rangeValues = numRangeString.slice(1, -1).split(',');

  // Convert the range values to numbers
  const rangeTuple = rangeValues.map((value) => Number(value.trim()));

  return rangeTuple;
};
