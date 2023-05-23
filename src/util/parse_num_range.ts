/**
 * A regular expression to match a SQL NUMRANGE string.
 * First capture group: opening bracket or parenthesis.
 * Second capture group: first number or NULL.
 * Third capture group: comma.
 * Fourth capture group: second number or NULL.
 * Fifth capture group: closing bracket or parenthesis.
 *
 * A capture group for 0-more whitespace characters is included before and after each capture group.
 */
const NUMRANGE_PATTERN = /(\[|\(){1}(\s)*([0-9]*|NULL)(\s)*(,)(\s)*([0-9]*|NULL)(\s)*(\]|\)){1}/i;

/**
 * Parse a SQL NUMRANGE string into a tuple of numbers.
 * @param numRangeString - Expected format: [1, 3) or (1, 3] or (1, 3) or [1, 3].
 * @returns
 */
export const parse_num_range = (numRangeString: string): Array<number | null> => {
  if (!NUMRANGE_PATTERN.test(numRangeString)) throw new Error(`Invalid NUMRANGE value: ${numRangeString}`);

  // Remove the surrounding brackets and split the string by comma
  const rangeValues = numRangeString.slice(1, -1).split(',');

  // Convert the range values to numbers
  const rangeTuple = rangeValues.map((value) => {
    const trimmedValue = value.trim();
    if (trimmedValue.toLocaleLowerCase() === 'null' || !trimmedValue.length) return null;
    return Number(trimmedValue);
  });

  return rangeTuple;
};
