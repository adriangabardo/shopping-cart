import { Client, PoolClient } from 'pg';
import { OrderRepository } from '../../repositories/OrderRepository';

import { INSERT_ORDER, FIND_ALL_ORDERS, FIND_ORDER_BY_ID, DELETE_ORDER } from '../../queries/orders';
import { OrderItemModel, OrderModel } from '../../types/Model';

import {
  DELETE_ORDER_ITEM,
  FIND_ORDER_ITEM_BY_ORDER_ID,
  FIND_ORDER_ITEM_BY_ORDER_ID_AND_PRODUCT_ID,
  INSERT_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
} from '../../queries/orderItems';

describe(OrderRepository, () => {
  let client: PoolClient & Client;
  let repository: OrderRepository;

  let queryMock: jest.Mock<any, any> = jest.fn();
  let releaseMock: jest.Mock<any, any> = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // @ts-expect-error
    client = { query: queryMock, release: releaseMock };
    repository = new OrderRepository(client);
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should call create with INSERT_ORDER and values', () => {
    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

    repository.create();

    expect(queryMock).toHaveBeenCalledWith(INSERT_ORDER, undefined);
  });

  it('should throw an error on update', () => {
    expect(() => repository.update({} as OrderModel)).toThrowError(
      'Orders cannot currently be updated. Add, update and remove items individually.'
    );
  });

  it('should call delete with DELETE_ORDER and values', () => {
    const test_order_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.delete(test_order_id);
    expect(queryMock).toHaveBeenCalledWith(DELETE_ORDER, [test_order_id]);
  });

  it('should call findById with FIND_ORDER_BY_ID and values', () => {
    const test_order_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findById(test_order_id);
    expect(queryMock).toHaveBeenCalledWith(FIND_ORDER_BY_ID, [test_order_id]);
  });

  it('should call findAll with FIND_ALL_ORDERS', () => {
    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findAll();
    expect(queryMock).toHaveBeenCalledWith(FIND_ALL_ORDERS);
  });

  it('should call createOrderItem with INSERT_ORDER_ITEM and values', () => {
    const test_order_item: OrderItemModel = {
      product_id: '1',
      order_id: '1',
      product_name: 'test',
      product_price: 1,
      quantity: 1,
    };

    queryMock.mockResolvedValue({ rows: [{ product_id: '1', order_id: '1' }], rowCount: 1 });

    repository.createOrderItem(test_order_item);

    expect(queryMock).toHaveBeenCalledWith(INSERT_ORDER_ITEM, [
      test_order_item.product_id,
      test_order_item.order_id,
      test_order_item.quantity,
    ]);
  });

  it('should call findOrderItemByOrderId with FIND_ORDER_ITEM_BY_ORDER_ID and values', () => {
    const test_order_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findOrderItemsByOrderId({ order_id: test_order_id });
    expect(queryMock).toHaveBeenCalledWith(FIND_ORDER_ITEM_BY_ORDER_ID, [test_order_id]);
  });

  it('should call findOrderItemByProductId with FIND_ORDER_ITEM_BY_ORDER_ID and values', () => {
    const test_product_id = '1';
    const test_order_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.findOrderItemByProductId({ product_id: test_product_id, order_id: test_order_id });
    expect(queryMock).toHaveBeenCalledWith(FIND_ORDER_ITEM_BY_ORDER_ID_AND_PRODUCT_ID, [
      test_order_id,
      test_product_id,
    ]);
  });

  it('should call updateOrderItem with UPDATE_ORDER_ITEM and values', () => {
    const test_order_item: OrderItemModel = {
      product_id: '1',
      order_id: '1',
      product_name: 'test',
      product_price: 1,
      quantity: 1,
    };

    queryMock.mockResolvedValue({ rows: [{ product_id: '1', order_id: '1' }], rowCount: 1 });

    repository.updateOrderItem(test_order_item);

    expect(queryMock).toHaveBeenCalledWith(UPDATE_ORDER_ITEM, [
      test_order_item.quantity,
      test_order_item.order_id,
      test_order_item.product_id,
    ]);
  });

  it('should call deleteOrderItem with DELETE_ORDER_ITEM and values', () => {
    const test_order_id = '1';
    const test_product_id = '1';

    queryMock.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });
    repository.deleteOrderItem({ order_id: test_order_id, product_id: test_product_id });
    expect(queryMock).toHaveBeenCalledWith(DELETE_ORDER_ITEM, [test_order_id, test_product_id]);
  });
});
