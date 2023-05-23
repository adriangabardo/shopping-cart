import { Client, PoolClient } from 'pg';

import { ProductsRepository } from '../../repositories/ProductsRepository';

import {
  DELETE_PRODUCT,
  FIND_ALL_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  INSERT_PRODUCT,
  UPDATE_PRODUCT,
} from '../../queries/products';

describe(ProductsRepository, () => {
  let client: PoolClient & Client;
  let repository: ProductsRepository;

  let queryMock: jest.Mock<any, any> = jest.fn();
  let releaseMock: jest.Mock<any, any> = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // @ts-expect-error
    client = { query: queryMock, release: releaseMock };
    repository = new ProductsRepository(client);
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('Should call create with INSERT_PRODUCT and values', () => {
    const test_product = {
      id: '1',
      inventory: 1,
      name: 'Test Product',
      price: 1.99,
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.create(test_product);

    expect(queryMock).toHaveBeenCalledWith(INSERT_PRODUCT, [
      test_product.id,
      test_product.name,
      test_product.price,
      test_product.inventory,
    ]);
  });

  it('Should call update with UPDATE_PRODUCT and values', () => {
    const test_product = {
      id: '1',
      inventory: 10,
      name: 'Test Product',
      price: 2.99,
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.update(test_product);

    expect(queryMock).toHaveBeenCalledWith(UPDATE_PRODUCT, [
      test_product.name,
      test_product.price,
      test_product.inventory,
      test_product.id,
    ]);
  });

  it('Should call delete with DELETE_PRODUCT and values', () => {
    const test_product = {
      id: '1',
      inventory: 10,
      name: 'Test Product',
      price: 2.99,
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.delete(test_product.id);
    expect(queryMock).toHaveBeenCalledWith(DELETE_PRODUCT, [test_product.id]);
  });

  it('Should call findById with FIND_PRODUCT_BY_ID and values', () => {
    const test_product = {
      id: '1',
      inventory: 10,
      name: 'Test Product',
      price: 2.99,
    };

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findById(test_product.id);
    expect(queryMock).toHaveBeenCalledWith(FIND_PRODUCT_BY_ID, [test_product.id]);
  });

  it('Should call findAll with FIND_ALL_PRODUCTS', () => {
    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findAll();
    expect(queryMock).toHaveBeenCalledWith(FIND_ALL_PRODUCTS, undefined);
  });
});
