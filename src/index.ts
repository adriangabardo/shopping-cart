// Make sure to import 'dotenv/config' before anything else
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';

import express_winston from 'express-winston';
import winston from 'winston';

import { discounts_router, orders_router, products_router } from './routes';
import { extract_environment_variables } from './util';

const { EXPRESS_PORT } = extract_environment_variables({ throwOnError: false }, 'EXPRESS_PORT');

const app = express();
const port = EXPRESS_PORT ?? 8000;

const logTransports = [new winston.transports.Console()];
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.json(),
  winston.format.prettyPrint()
);

app.use(bodyParser.json());

// Log incoming requests
app.use(express_winston.logger({ transports: logTransports, format: logFormat }));

app.use('/products', products_router);
app.use('/discounts', discounts_router);
app.use('/orders', orders_router);

// Fallback route that returns 404
app.get('*', function (req, res) {
  res.status(404).send('Route not available.');
});

// Log thrown errors
app.use(express_winston.errorLogger({ transports: logTransports, format: logFormat }));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
