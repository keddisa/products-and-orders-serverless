import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

import { headers } from '/opt/nodejs/mainHelpers'
import { getAllProducts } from '/opt/nodejs/db'
import { Product } from 'types'

AWS.config.update({region: "us-east-1"})

const dbClient = new AWS.DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {


    const products: Product[] = await getAllProducts(dbClient)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Products has been successfully retrieved',
            data: products
        }),
        headers
    }
};