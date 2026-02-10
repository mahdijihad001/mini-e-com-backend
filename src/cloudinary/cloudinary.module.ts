import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [],
  providers: [CloudinaryService , CloudinaryProvider],
    exports: [CloudinaryProvider, CloudinaryProvider]
})
export class CloudinaryModule {}
