import express from 'express';
import { discountsGet } from '../../controllers';

const discounts_router = express.Router();

discounts_router.get('/', discountsGet);

export { discounts_router };
