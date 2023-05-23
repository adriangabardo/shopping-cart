import { parse_num_range } from '../../util/parse_num_range';

describe(parse_num_range, () => {
  test.each([
    { input: '[1, 2)', output: [1, 2] },
    { input: '[3, 4]', output: [3, 4] },
    { input: '(9, 12]', output: [9, 12] },
    { input: '(1, 2)', output: [1, 2] },
    { input: '(NULL, 2)', output: [null, 2] },
    { input: '(NULL, )', output: [null, null] },
  ])('should parse valid NUMRANGE values into tuples', ({ input, output }) => {
    expect(parse_num_range(input)).toEqual(output);
  });

  test.each([
    { input: 1234 },
    { input: undefined },
    { input: [9, 12] },
    { input: Buffer.from('hello') },
    { input: null },
  ])('invalid inputs should throw error', ({ input }) => {
    // @ts-expect-error
    expect(() => parse_num_range(input)).toThrowError(`Invalid NUMRANGE value: ${input}`);
  });
});
