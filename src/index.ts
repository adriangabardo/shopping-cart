// Make sure to import 'dotenv/config' before anything else
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { discounts_router, orders_router, products_router } from './routes';

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/products', products_router);
app.use('/discounts', discounts_router);
app.use('/orders', orders_router);

app.get('*', function (req, res) {
  res.status(404).send('Route not available.');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
