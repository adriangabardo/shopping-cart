import express from 'express';
import { discountsGet } from '../../controllers';

const discounts_router = express.Router();

discounts_router.get('/', discountsGet);

export { discounts_router };

/**
 * ADRIAN NOTES:
 * Can easily extended the routes here to include:
 * - Getting a single discount
 * - Creating a discount
 * - Editing a discount
 * - Deleting a discount
 * - Getting all restrictions for a discount
 * - Creating a restriction for a discount
 * - Editing a restriction for a discount
 * - Deleting a restriction for a discount
 */
