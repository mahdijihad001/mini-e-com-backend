import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/sign.in.dto';
import { SignUpDto } from './dto/signup.dto';
import { SUCCESS_MESSAGES } from 'src/common/constants';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("sign-in")
  @ApiOperation({
    summary: "SignIn User"
  })
  async signInUser(@Body() dto: SignInDto) {
    const result = await this.authService.signIn(dto);

    return {
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: result
    }

  };


  @Post("sign-up")
  @ApiOperation({
    summary: "User SignUp"
  })
  async signUpUser(@Body() dto: SignUpDto) {
    const result = await this.authService.singUp(dto);

    return {
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: result
    }
  };


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

    await this.authService.deleteUser(user.id);

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
    await this.authService.deleteUser(id);

    return {
      success: true,
      message: "User Deleted Success"
    }

  }


}
