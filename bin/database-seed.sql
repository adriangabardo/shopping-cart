-- Create database
CREATE DATABASE "SHOPPING_CART";

-- Connect to the SHOPPING_CART database
\c SHOPPING_CART

-- Create "uuid-ossp" extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create PRODUCT table
CREATE TABLE PRODUCT (
  -- ID is the product SKU
  ID VARCHAR(50) PRIMARY KEY,
  Name TEXT,
  Price MONEY,
  Inventory INT
);

-- Create DISCOUNT table
CREATE TABLE DISCOUNT (
  ID UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  TYPE VARCHAR(10) CHECK (TYPE IN ('PERCENTAGE', 'FIXED')),
  AMOUNT MONEY,
  EXPLANATION TEXT
);

-- Create RESTRICTION table
CREATE TABLE RESTRICTION (
  ID UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  DISCOUNT_ID UUID,
  PRODUCT_ID VARCHAR(50),
  LOWER_BOUND INT,
  UPPER_BOUND INT,
  FOREIGN KEY (DISCOUNT_ID) REFERENCES DISCOUNT(ID),
  FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCT(ID)
);

-- Insert sample data into PRODUCT table
INSERT INTO PRODUCT (ID, Name, Price, Inventory)
VALUES
  ('120P90', 'Google Home', 49.99, 10),
  ('43N23P', 'MacBook Pro', 5399.99, 5),
  ('A304SD', 'Alexa Speaker', 109.50, 10),
  ('234234', 'Raspberry Pi B', 30.00, 2);

-- Insert sample data into DISCOUNT table and retrieve the generated discount IDs
WITH raspberry_discount AS (
  INSERT INTO DISCOUNT (TYPE, AMOUNT, EXPLANATION)
  VALUES ('FIXED', 30.00, 'Free Raspberry Pi B with MacBook Pro')
  RETURNING ID
),
google_home_discount AS (
  INSERT INTO DISCOUNT (TYPE, AMOUNT, EXPLANATION)
  VALUES ('FIXED', 49.99, '3 Google Homes for the price of 2')
  RETURNING ID
),
alexa_discount AS (
  INSERT INTO DISCOUNT (TYPE, AMOUNT, EXPLANATION)
  VALUES ('PERCENTAGE', 10, '10% discount when buying 3 or more Alexa Speakers')
  RETURNING ID
)

-- Insert sample data into RESTRICTION table using the retrieved discount IDs
INSERT INTO RESTRICTION (ID, DISCOUNT_ID, PRODUCT_ID, LOWER_BOUND, UPPER_BOUND)
VALUES
  (uuid_generate_v4(), (SELECT ID FROM raspberry_discount), '43N23P', 1, 1),
  (uuid_generate_v4(), (SELECT ID FROM google_home_discount), '120P90', 3, 3),
  (uuid_generate_v4(), (SELECT ID FROM alexa_discount), 'A304SD', 3, NULL),
  (uuid_generate_v4(), (SELECT ID FROM raspberry_discount), '234234', 1, 1);
