import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

import { headers } from '/opt/nodejs/mainHelpers'
import { getProductById } from '/opt/nodejs/db'
import { Product } from 'types'

AWS.config.update({region: "us-east-1"})

const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters?.id

    if(!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({_errors: ['Product ID is required']}),
            headers
        }
    }
    const products: Product = await getProductById(productId, dbClient)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Product has been successfully retrieved',
            data: products
        }),
        headers
    }
};