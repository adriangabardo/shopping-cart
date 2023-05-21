import { productsGet } from '../../controllers';
import express from 'express';

const products_router = express.Router();

products_router.get('/', productsGet);

export { products_router };
