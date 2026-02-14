import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AtStrategie } from './strategies/at.strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt") || "rt-jwt",
        signOptions: {
          expiresIn: "7d"
        }
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategie],
})
export class AuthModule { }
