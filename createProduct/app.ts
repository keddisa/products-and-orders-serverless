import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import AWS from 'aws-sdk'
import { ulid } from 'ulid'

import { headers } from '/opt/nodejs/mainHelpers'
import { createProduct } from '/opt/nodejs/db'
import { Product } from 'types'

AWS.config.update({region: "us-east-1"})

const db = new AWS.DynamoDB({apiVersion: "2012-08-10"})

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const {
        name,
        quantity,
        unitPrice
    }: Product = JSON.parse(event.body || "{}")

    console.log({
        name,
        quantity,
        unitPrice
    })

    if(!name || !quantity || !unitPrice) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                _errors: ["All fields are required"]
            }),
            headers
        }
    }

    const id = ulid()

    await createProduct(id, name, unitPrice, quantity, db)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Product has been successfully created',
            data: {id, name, quantity, unitPrice}}),
        headers
    }
};