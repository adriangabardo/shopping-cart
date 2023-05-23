import { Client, PoolClient } from 'pg';

import { DiscountsRepository } from '../../repositories/DiscountsRepository';

import {
  DELETE_DISCOUNT,
  FIND_ALL_DISCOUNTS,
  FIND_DISCOUNT_BY_ID,
  INSERT_DISCOUNT,
  UPDATE_DISCOUNT,
} from '../../queries/discounts';

import { DiscountModel, RestrictionModel } from '../../types/Model';

import {
  DELETE_RESTRICTION,
  FIND_RESTRICTION_BY_DISCOUNT_ID,
  FIND_RESTRICTION_BY_ID,
  INSERT_RESTRICTION,
  UPDATE_RESTRICTION,
} from '../../queries/restrictions';

describe(DiscountsRepository, () => {
  let client: PoolClient & Client;
  let repository: DiscountsRepository;

  let queryMock: jest.Mock<any, any> = jest.fn();
  let releaseMock: jest.Mock<any, any> = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // @ts-expect-error
    client = { query: queryMock, release: releaseMock };
    repository = new DiscountsRepository(client);
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('Should call create with INSERT_DISCOUNT and values', () => {
    const test_discount: Omit<DiscountModel, 'id'> = {
      amount: 10,
      discount_type: 'PERCENTAGE',
      explanation: 'test',
      restrictions: [],
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.create(test_discount);

    expect(queryMock).toHaveBeenCalledWith(INSERT_DISCOUNT, [
      test_discount.discount_type,
      test_discount.amount,
      test_discount.explanation,
    ]);
  });

  it('Should call update with UPDATE_DISCOUNT and values', () => {
    const test_discount: DiscountModel = {
      id: '1',
      amount: 10,
      discount_type: 'PERCENTAGE',
      explanation: 'test',
      restrictions: [],
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.update(test_discount);

    expect(queryMock).toHaveBeenCalledWith(UPDATE_DISCOUNT, [
      test_discount.discount_type,
      test_discount.amount,
      test_discount.explanation,
      test_discount.id,
    ]);
  });

  it('Should call delete with DELETE_DISCOUNT and values', () => {
    const test_discount_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.delete(test_discount_id);
    expect(queryMock).toHaveBeenCalledWith(DELETE_DISCOUNT, [test_discount_id]);
  });

  it('Should call findById with FIND_DISCOUNT_BY_ID and values', () => {
    const test_discount_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findById(test_discount_id);
    expect(queryMock).toHaveBeenCalledWith(FIND_DISCOUNT_BY_ID, [test_discount_id]);
  });

  it('Should call findAll with FIND_ALL_DISCOUNTS', () => {
    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findAll();
    expect(queryMock).toHaveBeenCalledWith(FIND_ALL_DISCOUNTS, undefined);
  });

  it('Should call createRestriction with INSERT_DISCOUNT_RESTRICTION and values', () => {
    const test_restriction: Omit<RestrictionModel, 'id' | 'productName'> = {
      product_id: '1',
      discount_id: '1',
      product_name: 'test',
      range: '[1, 2)',
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.createRestriction(test_restriction);
    expect(queryMock).toHaveBeenCalledWith(INSERT_RESTRICTION, [
      test_restriction.product_id,
      test_restriction.discount_id,
      JSON.stringify(test_restriction.range),
    ]);
  });

  it('Should call deleteRestriction with DELETE_DISCOUNT_RESTRICTION and values', () => {
    const test_restriction_id = '1';

    queryMock.mockResolvedValue(undefined);
    repository.deleteRestriction(test_restriction_id);
    expect(queryMock).toHaveBeenCalledWith(DELETE_RESTRICTION, [test_restriction_id]);
  });

  it('Should call updateRestriction with UPDATE_DISCOUNT_RESTRICTION and values', () => {
    const test_restriction: RestrictionModel = {
      id: '1',
      product_id: '1',
      discount_id: '1',
      product_name: 'test',
      range: '[1, 2)',
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.updateRestriction(test_restriction);

    expect(queryMock).toHaveBeenCalledWith(UPDATE_RESTRICTION, [
      test_restriction.product_id,
      test_restriction.discount_id,
      JSON.stringify(test_restriction.range),
      test_restriction.id,
    ]);
  });

  it('Should call findRestrictionsByDiscountId with FIND_RESTRICTION_BY_DISCOUNT_ID and values', () => {
    const test_discount_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findRestrictionsByDiscountId(test_discount_id);
    expect(queryMock).toHaveBeenCalledWith(FIND_RESTRICTION_BY_DISCOUNT_ID, [test_discount_id]);
  });

  it('Should call findRestrictionById with FIND_RESTRICTION_BY_ID and values', () => {
    const test_restriction_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findRestrictionById(test_restriction_id);
    expect(queryMock).toHaveBeenCalledWith(FIND_RESTRICTION_BY_ID, [test_restriction_id]);
  });
});
