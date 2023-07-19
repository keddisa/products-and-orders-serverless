import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'
import { ulid } from 'ulid'

import { headers } from '/opt/nodejs/mainHelpers'
import { createOrder, createProduct, getProductsByIds, updateProduct } from '/opt/nodejs/db'
import { Product, OrderItem, Order } from 'types'

AWS.config.update({region: "us-east-1"})

const db = new AWS.DynamoDB({apiVersion: "2012-08-10"})
const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const {
        orderItems,
        shippingAddress
    }: Order = JSON.parse(event.body || "{}")


    if(!orderItems || !orderItems.length) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                _errors: ["Order items are required to create an order"]
            }),
            headers
        }
    }

    if(!shippingAddress) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                _errors: ["Shipping Address is required"]
            }),
            headers
        }
    }

    const id = ulid()

    const productIds = orderItems.map(({id}) => id)

    const products: Product[] = await getProductsByIds(productIds, dbClient)

    console.log(products)

    let totalValue = 0

    // Calculate total value and validate
    for(const item of orderItems) {
        const productRecord = products.filter(({id}) => id === item.id)[0]
        if(productRecord.quantity < item.quantity) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    _errors: [`No sufficient quantity for product: ${productRecord.name}. There are only ${productRecord.quantity} units available`]
                }),
                headers
            }
        }
        const unitPrice = productRecord.unitPrice
        totalValue += unitPrice * item.quantity
    }

    // Update product quantity in database
    for(const item of orderItems) {
        const productRecord = products.filter(({id}) => id === item.id)[0]
        await updateProduct(item.id, null, null, productRecord.quantity - item.quantity, dbClient)
    }

    await createOrder(id, orderItems, shippingAddress, totalValue, db)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Order has been successfully created',
            data: {id, orderItems, shippingAddress, totalValue}
        }),
        headers
    }
};