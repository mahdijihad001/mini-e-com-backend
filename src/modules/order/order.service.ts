import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlaceOrderDto } from './dto/place.order.dto';

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

        const totalAmnount = findItem.reduce((total, item) => {
            return total + (Number(item.price) * item.quantity)
        }, 0)

        await this.prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                totalAmount: totalAmnount
            }
        });

        if (findItem.length) {
            findItem.map(async (item) => await this.prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    price: item.price,
                    quantity: item.quantity
                }
            }))
        };

        const cretePayment = await this.prisma.payment.create({
            data: {
                amount: totalAmnount,
                orderId: order.id,
                status: "PENDING"
            }
        });

        return cretePayment;

    }

}
