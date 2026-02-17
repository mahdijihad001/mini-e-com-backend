import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add.to.cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async addCart(data: AddToCartDto, userId: string) {

        const product = await this.prisma.product.findUnique({
            where: {
                id: data.productId
            }
        });

        if (!product) throw new NotFoundException("Product Not exist.");

        const isExistProduct = await this.prisma.cart.findFirst({
            where: {
                productId: data.productId,
                userId: userId
            }
        });

        if (isExistProduct) throw new BadRequestException("Already exist this product in the cart");

        if (product.status !== "ACTIVE") {
            throw new BadRequestException(`Sorry, this product cannot be added to the cart at this moment`);
        }

        await this.prisma.cart.create({
            data: {
                productId: data.productId,
                userId: userId
            }
        });

        return null;
    };

    async getMyCart(userId: string) {
        return await this.prisma.cart.findMany({
            where: {
                userId: userId
            }
        })
    };

    async removeItemFromMyCart(cartId: string, userId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: {
                id: cartId
            }
        });

        if (!cart) throw new NotFoundException("Cart item not found");

        if (cart?.userId !== userId) throw new BadRequestException("You are not allowed to perform this action on this cart")

        await this.prisma.cart.delete({
            where: {
                id: cartId
            }
        })

    }


}
