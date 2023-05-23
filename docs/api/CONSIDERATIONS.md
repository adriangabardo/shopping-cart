# API Considerations

Please check the OpenAPI specification for better details on the available routes and their API contracts.

## Available Endpoints

### Retrieving resources

To retrieve resources, these endpoints are currently available:

- GET /products
- GET /discounts
- GET /orders
- GET /orders/:id
- GET /orders/:orderId/items/:itemId

### Creating resources

Currently, only new orders can be created. And items can be added to orders by using the /add endpoint.

- POST /orders
- POST /orders/:id/add

### Order checkout

Once all items are added to an order, to see what discounts will be applied to the order, the checkout endpoint can be used.

- POST /orders/:id/checkout

## Overview

In regards to the Express server, I have prioritised writing all the code for the Repositories, making sure all queries are functioning as intended, and chose to implement only the critical routes and controllers.

All the repository methods are in place to further extend routes and controllers, but running out of time, I decided against implementing a lot of the routes for editing and deleting resources.

I deemed viewing all resources, and creating new orders to be the most crucial aspects of this application.

## Areas of Improvement

### Error handling

The API currently only uses two error codes, 404 for routes not found, and 500 for all exceptions. This could be greatly improved.

All other areas of improvement are already covered under the main `CONSIDERATIONS.md`.
