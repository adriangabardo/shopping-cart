export interface ProductModel {
  /*
   *  The SKU of the product
   */
  id: string;
  /**
   * A human friendly name of the product
   */
  name: string;
  /**
   * The price of the product, saved as MONEY in the database.
   * This value is casted as numeric in the SQL query.
   */
  price: number;
  /**
   * The amount of the product in stock.
   */
  inventory: number;
}
