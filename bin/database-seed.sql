-- Create database
CREATE DATABASE "SHOPPING_CART";

-- Connect to the SHOPPING_CART database
\c SHOPPING_CART

-- Create "uuid-ossp" extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create PRODUCTS table
CREATE TABLE PRODUCTS (
  -- ID is the product SKU
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  price MONEY NOT NULL,
  inventory INT NOT NULL
);

CREATE TYPE DISCOUNT_TYPE AS ENUM ('PERCENTAGE', 'FIXED');

-- Create DISCOUNTS table
CREATE TABLE DISCOUNTS (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  discount_type DISCOUNT_TYPE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  explanation TEXT NOT NULL
);

-- Create RESTRICTION table
CREATE TABLE RESTRICTIONS (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  discount_id UUID REFERENCES DISCOUNTS(ID) NOT NULL,
  product_id VARCHAR(50) REFERENCES PRODUCTS(ID) NOT NULL,
  range NUMRANGE NOT NULL
);

-- Create the ORDERS table
CREATE TABLE ORDERS (
  ID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  CREATED_DATE DATE DEFAULT CURRENT_DATE NOT NULL
);

-- Create the ORDER_ITEMS table
CREATE TABLE ORDER_ITEMS (
  PRODUCT_ID VARCHAR(255) REFERENCES PRODUCTS (ID) NOT NULL,
  ORDER_ID UUID REFERENCES ORDERS (ID) NOT NULL,
  QUANTITY INT NOT NULL,
  PRIMARY KEY (PRODUCT_ID, ORDER_ID)
);

-- Insert sample data into PRODUCTS table
INSERT INTO PRODUCTS (ID, Name, Price, Inventory)
VALUES
  ('120P90', 'Google Home', 49.99, 10),
  ('43N23P', 'MacBook Pro', 5399.99, 5),
  ('A304SD', 'Alexa Speaker', 109.50, 10),
  ('234234', 'Raspberry Pi B', 30.00, 2);

-- Insert sample data into DISCOUNTS table and retrieve the generated discount IDs
WITH raspberry_discount AS (
  INSERT INTO DISCOUNTS (discount_type, amount, explanation)
  VALUES ('FIXED', 30.00, 'Free Raspberry Pi B with MacBook Pro')
  RETURNING id
),
google_home_discount AS (
  INSERT INTO DISCOUNTS (discount_type, amount, explanation)
  VALUES ('FIXED', 49.99, '3 Google Homes for the price of 2')
  RETURNING id
),
alexa_discount AS (
  INSERT INTO DISCOUNTS (discount_type, amount, explanation)
  VALUES ('PERCENTAGE', 0.1, '10% discount when buying 3 or more Alexa Speakers')
  RETURNING id
)

-- Insert sample data into RESTRICTION table using the retrieved discount IDs
INSERT INTO RESTRICTIONS (id, discount_id, product_id, range)
VALUES
  (uuid_generate_v4(), (SELECT id FROM raspberry_discount), '43N23P', '[1, 1]'),
  (uuid_generate_v4(), (SELECT id FROM google_home_discount), '120P90', '[3, 3]'),
  (uuid_generate_v4(), (SELECT id FROM alexa_discount), 'A304SD', '[3,)'),
  (uuid_generate_v4(), (SELECT id FROM raspberry_discount), '234234', '[1, 1]');

-- Insert sample data into ORDERS and ORDER_ITEMS table
WITH new_order AS (INSERT INTO ORDERS DEFAULT VALUES RETURNING id)

INSERT INTO ORDER_ITEMS (PRODUCT_ID, ORDER_ID, QUANTITY)
VALUES
  ('120P90', (SELECT id FROM new_order), 2),
  ('43N23P', (SELECT id FROM new_order), 1);