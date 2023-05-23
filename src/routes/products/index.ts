import { productsGet } from '../../controllers';
import express from 'express';

const products_router = express.Router();

products_router.get('/', productsGet);

/**
 * ADRIAN NOTES:
 * Can easily extended the routes here to include:
 * - Getting a single product
 * - Creating a product
 * - Editing a product
 * - Deleting a product
 */

export { products_router };
