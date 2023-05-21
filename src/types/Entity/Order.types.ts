import { OrderItemModel, OrderModel } from '../Model';

export type Order = OrderModel & {
  items: OrderItemModel[];
};
