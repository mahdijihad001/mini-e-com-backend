import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';
import { UpdateUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get("get-me")
  @ApiOperation({
    summary: "Get Me"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const user = req.user;
    return {
      success: true,
      message: "Profile Retrived Success",
      data: user
    }
  }

  @Delete("user-delete")
  @ApiOperation({
    summary: "User Own Profile Delete"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)

  async DeleteOwnProfile(@Req() req: any) {
    const user = req.user;

    await this.userService.deleteUser(user.id);

    return {
      success: true,
      message: "User Deleted Success",
      data: null
    }

  }


  @Delete('admin-user/:userId/delete')
  @ApiOperation({
    summary: "User profile delete (Only Can Do this Admin)"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async UserDeleteFormAdmin(@Param("userId") id: string) {
    await this.userService.deleteUser(id);

    return {
      success: true,
      message: "User Deleted Success"
    }

  }

  @Get("single-user/:userId/profile")
  @ApiOperation({
    summary: "Single User Profile (Only Can Admin)"
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async singleUserProfile(@Param("userId") userId: string) {

    const result = await this.userService.getSingleUser(userId);

    return {
      success: true,
      message: "User Profile Retrived",
      data: result
    }
  };



  @Patch('update-profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile (Only Can Login User Own Profile)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'User name', example: 'Mehedi Hasan Jihad' },
        phone: { type: 'string', description: 'Phone number', example: '01783123456' },
        profile: {
          type: 'string',
          format: 'binary',
          description: 'Optional profile image',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profile'))
  async updateProfile(
    @Body() body: UpdateUserDto,
    @UploadedFile() profile: Express.Multer.File,
    @Req() req: any
  ) {

    const id = req.user.id;

    const result = await this.userService.updateUserProfile(id, body, profile);

    return {
      success: true,
      message: "Profile Updated",
      data: result
    }

  }


  @Get("get-all-user")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({
    summary: "All user list (Only Can Admin)"
  })
  @ApiQuery({ name: "page", required: true, example: 1 })
  @ApiQuery({ name: "limit", required: true, example: 10 })
  @ApiQuery({ name: "search", required: false, example: "" })
  async AllUserList(@Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number, @Query("search") search: string) {
    const result = await this.userService.getAllUser(page, limit, search);

    return {
      success: true,
      message: "All user list",
      data: result
    }

  }
}
