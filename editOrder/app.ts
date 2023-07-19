import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

import { headers } from '/opt/nodejs/mainHelpers'
import { deleteProductById, getOrderById, getProductById, updateOrder, updateProduct } from '/opt/nodejs/db'
import { Order } from 'types'

AWS.config.update({region: "us-east-1"})

const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const orderId = event.pathParameters?.id

    const {
        orderStatus,
        trackingNumber,
        trackingCompany
    }: Order = JSON.parse(event.body || "{}")

    if(!orderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({_errors: ['Order ID is required']}),
            headers
        }
    }

    await updateOrder(orderId, orderStatus, trackingNumber, trackingCompany, dbClient)
    const updatedOrder = await getOrderById(orderId, dbClient)
    const parsedOrderItems = updatedOrder.orderItems.values.map((item: string) => JSON.parse(item))
    updatedOrder.orderItems = parsedOrderItems

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Order has been successfully updated',
            data: updatedOrder
        }),
        headers
    }
};