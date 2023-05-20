import { OrderItem } from './OrderItem.types';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
}
