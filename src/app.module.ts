import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import envConfig from './config/env.config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
    cache: true
  }), AuthModule, UserModule, CloudinaryModule, CategoryModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
