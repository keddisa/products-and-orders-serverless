import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

import { headers } from '/opt/nodejs/mainHelpers'
import { getAllOrders } from '/opt/nodejs/db'
import { Order } from 'types'

AWS.config.update({region: "us-east-1"})

const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {


    const orders: Order[] = await getAllOrders(dbClient)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Orders has been successfully retrieved',
            data: orders
        }),
        headers
    }
};