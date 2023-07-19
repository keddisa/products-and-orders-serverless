# Serverless Backend for Products and Orders
This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- getOrder, getOrders, getProduct, getProducts, createOrder, createProduct, deleteOrder, deleteProduct, editOrder, edit Product - Code for the application's Lambda function written in TypeScript.
- layers - Code for common utility functions share between all lambda functions
- events - Invocation events that you can use to invoke the function. (currently empty)
- template.yaml - A template that defines the application's AWS resources.
- MakeFile - Contains commands to build and deploy changes to the applications

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

<hr>

## Deploy the application

To deploy any changes to the application, run the following commands

```bash
make build
make deploy
```

<hr>

## Run the application locally

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.


```bash
sam local start-api
```

<hr>

## Functionality

- Endpoints created:
1. `GET /products` Gets a list of all existing products
1. `GET /product/{id}` Get a specific product given its ID
1. `POST /product` Creates a new product
1. `PATCH /product/{id}` Update a specific product given its ID
1. `Delete /product/{id}` Delete a specific product given its ID
1. `GET /orders` Gets a list of all existing orders
1. `GET /order/{id}` Get a specific order given its ID
1. `POST /order` Creates a new order
1. `PATCH /order/{id}` Update a specific order given its ID

- Assumptions:
1. Product model consists of product name, quantity in stock, and unit price
1. Order model consists of a list of products, shipping address, order status and shipping details (tracking number and tracking company)
1. All properties of a product can be updated
1. only order status and shipping details can be updated for an order

<hr>

## Limitations

- Application doesn't have any authentication or authorization layer. Same user can successfully invoke all api endpoints
- Because the application has a small amount of data, we're getting all orders and all products on the home page.
1. No funcationality has been introduced to search for a product by name, get products by a certain supplier, filter by price, etc
1. As the applicatioin grows, the database needs to be indexed based on what queries are going to be required.
- No caching is implemented at this stage
