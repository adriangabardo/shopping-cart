## Database Schema

### Table: PRODUCT

| Column    | Type        |
| --------- | ----------- |
| ID (PK)   | VARCHAR(50) |
| Name      | TEXT        |
| Price     | MONEY       |
| Inventory | INT         |

### Table: DISCOUNT

| Column      | Type        |
| ----------- | ----------- |
| ID (PK)     | UUID        |
| TYPE        | VARCHAR(10) |
| AMOUNT      | MONEY       |
| EXPLANATION | TEXT        |

### Table: RESTRICTION

| Column      | Type             |
| ----------- | ---------------- |
| ID (PK)     | UUID             |
| DISCOUNT_ID | UUID (FK)        |
| PRODUCT_ID  | VARCHAR(50) (FK) |
| LOWER_BOUND | INT              |
| UPPER_BOUND | INT              |
