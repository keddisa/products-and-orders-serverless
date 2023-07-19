import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

import { headers } from '/opt/nodejs/mainHelpers'
import { getProductById, getOrderById } from '/opt/nodejs/db'
import { Order, Product } from 'types'

AWS.config.update({region: "us-east-1"})

const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const orderId = event.pathParameters?.id

    if(!orderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({_errors: ['Order ID is required']}),
            headers
        }
    }
    const order: Order = await getOrderById(orderId, dbClient)

    console.log('order', order)
    // Get products associated with Order
    const orderItems = await Promise.all(order.orderItems.values.map(async stringified => {
        const {id, quantity} = JSON.parse(stringified)
        const product: Product = await getProductById(id, dbClient)
        return {
            id,
            name: product.name,
            unitPrice: product.unitPrice,
            quantity
        }
    }))

    console.log('orderItems', orderItems)

    order.orderItems = orderItems

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Order has been successfully retrieved',
            data: order
        }),
        headers
    }
};