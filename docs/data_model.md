## Data Model

### Table: PRODUCTS

| Column Name | Data Type   |
| ----------- | ----------- |
| id          | VARCHAR(50) |
| name        | TEXT        |
| price       | MONEY       |
| inventory   | INT         |

### Table: DISCOUNTS

| Column Name   | Data Type      |
| ------------- | -------------- |
| id            | UUID           |
| discount_type | DISCOUNT_TYPE  |
| amount        | NUMERIC(10, 2) |
| explanation   | TEXT           |

### Table: RESTRICTIONS

| Column Name | Data Type   |
| ----------- | ----------- |
| id          | UUID        |
| discount_id | UUID        |
| product_id  | VARCHAR(50) |
| range       | NUMRANGE    |

### Table: ORDERS

| Column Name  | Data Type |
| ------------ | --------- |
| id           | UUID      |
| created_date | DATE      |

### Table: ORDER_ITEMS

| Column Name | Data Type    |
| ----------- | ------------ |
| product_id  | VARCHAR(255) |
| order_id    | UUID         |
| quantity    | INT          |
