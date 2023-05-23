import { DiscountModel, OrderItemModel, OrderModel, ProductModel, RestrictionModel } from '../../types/Model';

export const google_home_product: ProductModel = {
  id: '120P90',
  name: 'Google Home',
  price: 49.99,
  inventory: 10,
};

export const macbook_pro_product: ProductModel = {
  id: '43N23P',
  name: 'MacBook Pro',
  price: 5399.99,
  inventory: 5,
};

export const raspberry_pi_product: ProductModel = { id: '234234', name: 'Raspberry Pi B', price: 30.0, inventory: 2 };

export const alexa_product: ProductModel = { id: 'A304SD', name: 'Alexa Speaker', price: 109.5, inventory: 10 };

export const google_home_orderItem: OrderItemModel = {
  product_id: google_home_product.id,
  product_name: google_home_product.name,
  product_price: google_home_product.price,
  order_id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf2fb',
  quantity: 3,
};

export const macbook_pro_orderItem: OrderItemModel = {
  product_id: macbook_pro_product.id,
  product_name: macbook_pro_product.name,
  product_price: macbook_pro_product.price,
  order_id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf123',
  quantity: 1,
};

export const raspberry_pi_orderItem: OrderItemModel = {
  product_id: raspberry_pi_product.id,
  product_name: raspberry_pi_product.name,
  product_price: raspberry_pi_product.price,
  order_id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf456',
  quantity: 1,
};

export const alexa_orderItem: OrderItemModel = {
  product_id: alexa_product.id,
  product_name: alexa_product.name,
  product_price: alexa_product.price,
  order_id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf789',
  quantity: 1,
};

export const order: OrderModel = {
  id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf2fb',
  created_date: new Date(),
  items: [],
};

export const google_home_restriction: RestrictionModel = {
  id: '4e984420-dd2a-428a-ad84-ca896d1cbc40',
  discount_id: '0834fc72-9c4e-4c91-bb53-e555177fff8d',
  product_id: google_home_product.id,
  product_name: google_home_product.name,
  range: '[3,3]',
};

export const macbook_pro_restriction: RestrictionModel = {
  id: '2d256b2b-f5f4-4e4d-9c28-d8de7c767df1',
  discount_id: '05e7945d-fad8-4e24-8758-1d11822f7772',
  product_id: '43N23P',
  product_name: 'MacBook Pro',
  range: '[1,1]',
};

export const raspberry_pi_restriction: RestrictionModel = {
  id: 'fc207551-89fe-47ab-a182-ba0f4ea159f5',
  discount_id: '05e7945d-fad8-4e24-8758-1d11822f7772',
  product_id: raspberry_pi_product.id,
  product_name: raspberry_pi_product.name,
  range: '[1,1]',
};

export const alexa_restriction: RestrictionModel = {
  id: 'bc529df8-68ab-41d4-8fb0-2a5396fefe5b',
  discount_id: 'abd567d0-c82b-4fbd-8ec2-2955d3344d56',
  product_id: alexa_product.id,
  product_name: alexa_product.name,
  range: '[3,)',
};

export const google_home_discount: DiscountModel = {
  id: '0834fc72-9c4e-4c91-bb53-e555177fff8d',
  discount_type: 'FIXED',
  amount: 49.99,
  explanation: '3 Google Homes for the price of 2',
  restrictions: [google_home_restriction],
};

export const raspberry_pi_discount: DiscountModel = {
  id: '05e7945d-fad8-4e24-8758-1d11822f7772',
  discount_type: 'FIXED',
  amount: 30.0,
  explanation: 'Free Raspberry Pi B with MacBook Pro',
  restrictions: [macbook_pro_restriction, raspberry_pi_restriction],
};

export const alexa_discount: DiscountModel = {
  id: 'abd567d0-c82b-4fbd-8ec2-2955d3344d56',
  discount_type: 'PERCENTAGE',
  amount: 0.1,
  explanation: '10% discount when buying 3 or more Alexa Speakers',
  restrictions: [alexa_restriction],
};
