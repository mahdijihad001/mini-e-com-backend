import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AddToCartDto } from './dto/add.to.cart.dto';
import { UpdateQuantityDto } from './dto/update.quentity.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post("add-to-cart")
  @ApiOperation({ summary: "Product Add to cart" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() dto: AddToCartDto, @Req() req: any) {
    const userId = req.user.id;

    await this.cartService.addCart(dto, userId);

    return {
      success: true,
      message: "Product added to cart"
    }
  }

  @Get("my-cart-list")
  @ApiOperation({ summary: "My all cart list" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myCartList(@Req() req: any) {
    const userId = req.user.id;

    const result = await this.cartService.getMyCart(userId);

    return {
      success: true,
      data: result
    }

  }

  @Delete("remove-item/:id/cart")
  @ApiOperation({ summary: "Remove item from own cart" })
  @ApiBearerAuth()
  @ApiParam({ name: "id", example: "cart Id" })
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(@Param("id") cartId: string, @Req() req: any) {

    const userId = req.user.id;

    await this.cartService.removeItemFromMyCart(cartId, userId);

    return {
      success: true,
      message: "Item remove from cart"
    }
  }


  @Patch("update/:cartId")
  @ApiOperation({ summary: "Update Cart Quentity" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateCartQuantity(@Param("cartId") cartId: string, @Body() body: UpdateQuantityDto, @Req() req: any) {
    const userId = req.user.id;

    await this.cartService.updateCartQuantity(userId, cartId, body.quantity);

    return {
      success: true,
      message: "Quentity updated"
    }

  }


}
