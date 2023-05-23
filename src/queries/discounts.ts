import { TABLE_NAME } from '../types';

export const INSERT_DISCOUNT = `INSERT INTO ${TABLE_NAME.DISCOUNTS} (discount_type, amount, explanation) VALUES ($1, $2, $3) RETURNING id`;
export const UPDATE_DISCOUNT = `UPDATE ${TABLE_NAME.DISCOUNTS} SET discount_type = $1, amount = $2, explanation = $3 WHERE id = $4`;
export const DELETE_DISCOUNT = `DELETE FROM ${TABLE_NAME.DISCOUNTS} WHERE id = $1`;

/**
 * This query finds a discount by its ID,
 * joining all restrictions which discount_id matches the discount's ID.
 */
export const FIND_DISCOUNT_BY_ID = `
    SELECT discount.*,
        json_agg(json_build_object(
            'id', restriction.id,
            'discountId', restriction.discount_id,
            'productId', restriction.product_id,
            'productName', product.name,
            'range', restriction.range
        )) AS restrictions
    FROM ${TABLE_NAME.DISCOUNTS} discount
    JOIN ${TABLE_NAME.RESTRICTIONS} restriction ON restriction.discount_id = discount.id
    JOIN ${TABLE_NAME.PRODUCTS} product ON restriction.product_id = product.id
    WHERE discount.id = $1
    GROUP BY discount.id;
`;

/**
 * This query finds all discounts, joining all restrictions which discount_id matches the discount's ID.
 * For each restriction, it also joins the product which ID matches the restriction's product_id so that the product's name can be displayed.
 */
export const FIND_ALL_DISCOUNTS = `
    SELECT discount.*,
        json_agg(json_build_object(
            'id', restriction.id,
            'discountId', restriction.discount_id,
            'productId', restriction.product_id,
            'productName', product.name,
            'range', restriction.range
        )) AS restrictions
    FROM ${TABLE_NAME.DISCOUNTS} discount
    JOIN ${TABLE_NAME.RESTRICTIONS} restriction ON restriction.discount_id = discount.id
    JOIN ${TABLE_NAME.PRODUCTS} product ON restriction.product_id = product.id
    GROUP BY discount.id;
`;
