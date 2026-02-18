import { Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { OrderStatus } from '@prisma/client';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post("make-order")
  @ApiOperation({ summary: "User can make a order" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async makeOrder(@Req() req: any) {
    const userId = req.user.id;

    await this.orderService.placeOrder(userId);

    return {
      success: true,
      message: "Order placed"
    }
  }

  @Patch("status/:orderId")
  @ApiOperation({ summary: "Update order status (Only Can Admin)" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiParam({ name: "orderId", example: "2sfsfe3eadart34rd" })
  @ApiQuery({ name: "status", enum: OrderStatus, example: OrderStatus.PENDING })
  async updateOrderStatus(@Param("orderId") orderId: string, @Query("status") status: "FAILED" | "PENDING" | "PROCESS" | "SHIPPED" | "DELIVERED") {
    await this.orderService.updateOrderStatus(orderId, status);

    return {
      success: true,
      message: "Order ststus updated."
    }
  }

  @Get("my-order")
  @ApiOperation({ summary: "User orders list" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myOrderList(@Req() req: any) {
    const userId = req.user.id;

    const result = await this.orderService.getMyOrderList(userId);

    return {
      success: true,
      data: result
    }
  };

  @Get("single/:orderId/list")
  @ApiOperation({ summary: "Single order list" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: "orderId", required: true, example: "order id" })
  async getSingleOrderList(@Param("orderId") orderId: string) {
    const result = await this.orderService.getSingleOrder(orderId);

    return {
      success: true,
      data: result
    }

  }


  @Get("all-order-list")
  @ApiOperation({ summary: "All order list for Admin" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 20 })
  @ApiQuery({ name: "status", required: false, enum: OrderStatus, example: OrderStatus.PENDING })
  async allOrderlist(@Query("page", ParseIntPipe) page: number = 1, @Query("limit", ParseIntPipe) limit: number = 20, @Query("status") status?: "FAILED" | "PENDING" | "PROCESS" | "SHIPPED" | "DELIVERED") {
    const result = await this.orderService.getAllOrderListForAdmin(page, limit, status);

    return {
      success: true,
      data: result
    }

  }

}
