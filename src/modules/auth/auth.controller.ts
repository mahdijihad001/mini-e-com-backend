import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/sign.in.dto';
import { SignUpDto } from './dto/signup.dto';
import { SUCCESS_MESSAGES } from 'src/common/constants';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';
import { RefreshTokenDto } from './dto/refresh.dto';

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

  @Post("refresh_token")
  @ApiOperation({
    summary: "Generate new access token use refresh token"
  })
  async refreshToken(@Body() data: RefreshTokenDto) {
    const result = await this.authService.generateAccessTokenWitRefreshToken(data.token);

    return {
      success: true,
      message: "Generate new accesstoken",
      accessToken: result
    }

  }



}
