export const createProduct = async(id: string, name: string, unitPirce: number, quantity: number, db: any) => {
    const now = new Date()

    try {
        const res = await db.putItem({
            TableName: 'Product',
            Item: {
                id: {
                    "S": id
                },
                name: {
                    "S": name
                },
                unitPrice: {
                    "N": `${unitPirce}`
                },
                quantity: {
                    "N": `${quantity}`
                },
                createdAt: {
                    "S": now.toISOString()
                },
                updatedAt: {
                    "S": now.toISOString()
                }
            }
        }).promise()
        return res
    } catch(e) {
        console.log(e)
    }
}


export const getAllProducts = async(dbClient: any) => {
    try {
        const res = await dbClient.scan({
            TableName: 'Product',
            FilterExpression: "attribute_not_exists(deletedAt)"
        }).promise()
        return res.Items
    } catch(e) {
        console.log(e)
        throw e
    }
}

export const getProductsByIds = async(productIds: string[], dbClient: any) => {
    const keyList = []
    try {
        for(const productId of productIds) {
            keyList.push({
                    "id": productId
            })
        }
        const res = await dbClient.batchGet({
            RequestItems :{
                ['Product']: {
                    Keys: keyList
                }
            }
        }).promise()
        return res?.Responses?.Product
    } catch(e) {
        console.log(e)
        throw e
    }
}

export const getProductById = async(id: string, dbClient: any) => {
    const params = {
        TableName: `Product`,
        Key: {
            id
        }
    }
    const res = await dbClient.get(params).promise()
    return res?.Item
}

export const deleteProductById = async(id: string, dbClient: any) => {
    const now = new Date()

    try {
        const res = await dbClient.update({
            TableName: 'Product',
            Key: {
                id,
            },

            UpdateExpression: 'set #date = :dateValue',
            ExpressionAttributeNames: {
                '#date' : 'deletedAt',
            },
            ExpressionAttributeValues: {
              ':dateValue' : now.toISOString()
            }
        }).promise()
        return res
    } catch(e) {
        console.log(e)
        throw e
    }
}

export const updateProduct = async(id: string, name: string | null = null, unitPrice: number | null = null, quantity: number | null = null, dbClient: any) => {
    const now = new Date()

    let UpdateExpression = 'set #date = :dateValue'

    const ExpressionAttributeNames: any = {
        '#date' : 'updatedAt',
    }

    const ExpressionAttributeValues: any = {
        ':dateValue' : now.toISOString()
    }

    if(name) {
        UpdateExpression = `${UpdateExpression}, #name = :nameValue`
        ExpressionAttributeNames['#name'] = 'name'
        ExpressionAttributeValues[':nameValue'] = name
    }

    if(unitPrice) {
        UpdateExpression = `${UpdateExpression}, #price = :priceValue`
        ExpressionAttributeNames['#price'] = 'unitPrice'
        ExpressionAttributeValues[':priceValue'] = unitPrice
    }

    if(quantity) {
        UpdateExpression = `${UpdateExpression}, #quantity = :quantityValue`
        ExpressionAttributeNames['#quantity'] = 'quantity'
        ExpressionAttributeValues[':quantityValue'] = quantity
    }

    try {
        const res = await dbClient.update({
            TableName: 'Product',
            Key: {
                id,
            },

            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        }).promise()
        return res
    } catch(e) {
        console.log(e)
        throw e
    }
}


export const createOrder = async(id: string, orderItems: any[], shippingAddress: string, totalValue: number, db: any) => {
    const now = new Date()

    const orderItemsSS = orderItems.map(item => JSON.stringify(item))

    try {
        const res = await db.putItem({
            TableName: 'Order',
            Item: {
                id: {
                    "S": id
                },
                orderItems: {
                    "SS": orderItemsSS
                },
                shippingAddress: {
                    "S": shippingAddress
                },
                totalValue: {
                    "N": `${totalValue}`
                },
                orderStatus: {
                    "S": 'Processing'
                },
                createdAt: {
                    "S": now.toISOString()
                },
                updatedAt: {
                    "S": now.toISOString()
                }
            }
        }).promise()
        return res
    } catch(e) {
        console.log(e)
        throw e
    }
}

export const getAllOrders = async(dbClient: any) => {
    try {
        const res = await dbClient.scan({
            TableName: 'Order',
        }).promise()
        return res.Items
    } catch(e) {
        console.log(e)
        throw e
    }
}


export const getOrderById = async(id: string, dbClient: any) => {
    const params = {
        TableName: `Order`,
        Key: {
            id
        }
    }
    const res = await dbClient.get(params).promise()
    return res?.Item
}

export const updateOrder = async(id: string, orderStatus: string | null = null, trackingNumber: string | null = null, trackingCompany: string | null = null, dbClient: any) => {
    const now = new Date()

    let UpdateExpression = 'set #date = :dateValue'

    const ExpressionAttributeNames: any = {
        '#date' : 'updatedAt',
    }

    const ExpressionAttributeValues: any = {
        ':dateValue' : now.toISOString()
    }

    if(orderStatus) {
        UpdateExpression = `${UpdateExpression}, #status = :statusValue`
        ExpressionAttributeNames['#status'] = 'orderStatus'
        ExpressionAttributeValues[':statusValue'] = orderStatus
    }

    if(trackingNumber) {
        UpdateExpression = `${UpdateExpression}, #trackingNumber = :trackingNumberValue`
        ExpressionAttributeNames['#trackingNumber'] = 'trackingNumber'
        ExpressionAttributeValues[':trackingNumberValue'] = trackingNumber
    }

    if(trackingCompany) {
        UpdateExpression = `${UpdateExpression}, #trackingCompany = :trackingCompanyValue`
        ExpressionAttributeNames['#trackingCompany'] = 'trackingCompany'
        ExpressionAttributeValues[':trackingCompanyValue'] = trackingCompany
    }

    try {
        const res = await dbClient.update({
            TableName: 'Order',
            Key: {
                id,
            },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        }).promise()
        return res
    } catch(e) {
        console.log(e)
        throw e
    }
}