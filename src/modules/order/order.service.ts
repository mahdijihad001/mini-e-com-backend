import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }

    async placeOrder(userId: string) {
        const order = await this.prisma.order.create({
            data: {
                userId: userId,
                totalAmount: 0.0
            }
        });

        if (!order) throw new BadRequestException("Order place faild");

        const findItem = await this.prisma.cart.findMany({
            where: {
                userId: userId
            }
        });

        if (findItem.length === 0) throw new BadRequestException("Your cart is empty. Please add items before proceeding.");

        const totalAmnount = findItem.reduce((total, item) => {
            return total + (Number(item.price) * Number(item.quantity))
        }, 0)

        await this.prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                totalAmount: totalAmnount
            }
        });

        // if (findItem.length) {
        //     findItem.map(async (item) => await this.prisma.orderItem.create({
        //         data: {
        //             orderId: order.id,
        //             productId: item.productId,
        //             price: item.price,
        //             quantity: item.quantity
        //         }
        //     }))
        // };

        await Promise.all(
            findItem.map((item) => this.prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    price: item.price,
                    quantity: item.quantity
                }
            }))
        )

        const cretePayment = await this.prisma.payment.create({
            data: {
                amount: totalAmnount,
                orderId: order.id,
                status: "PENDING"
            }
        });

        return cretePayment;

    }

    async updateOrderStatus(orderId: string, status: "FAILED" | "PENDING" | "PROCESS" | "SHIPPED" | "DELIVERED") {
        const order = await this.prisma.order.findUnique({
            where: {
                id: orderId
            }
        });

        if (!order) throw new NotFoundException("Order not found");

        const update = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: status
            }
        });

        return update;

    };


    async getMyOrderList(userId: string) {
        const OrderList = await this.prisma.order.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profile: true,
                        role: true
                    }
                }
            }
        });

        return OrderList;

    }

    async getSingleOrder(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profile: true,
                        role: true
                    }
                },
                items: {
                    include : {
                        product : {
                            select : {
                                name : true,
                                thumbnail : true
                            }
                        }
                    }
                },
            }
        });

        if (!order) throw new NotFoundException("Order not found");

        return order;
    }

    async getAllOrderListForAdmin(page: number, limit: number, status?: "FAILED" | "PENDING" | "PROCESS" | "SHIPPED" | "DELIVERED") {

        const skip = (page - 1) * limit;

        const filter: any = {};

        if (status) {
            filter.status = status
        }

        const total = await this.prisma.order.count({ where: filter });

        const orders = await this.prisma.order.findMany({
            where: filter,
            skip: skip,
            take: limit
        });

        return {
            success: true,
            data: {
                pagination: {
                    total: total,
                    totalPage: Math.ceil(total / limit),
                    page: page,
                    limit: limit
                },
                data: orders
            }
        }

    }
}
