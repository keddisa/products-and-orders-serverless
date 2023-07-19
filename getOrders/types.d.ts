export interface Product {
    id?: string
    name: string
    unitPrice: number
    quantity: number
}

export interface Order {
    id?: string
    orderItems: OrderItem[]
    orderStatus: string
    shippingAddress: string
    totalValue: number
    trackingNumber?: string
    trackingCompany?: string
}

export interface OrderItem {
    id: string,
    quantity: number,
    name?: string
}