import { BadRequestException, Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create.product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @Post('create-product')
  @ApiOperation({ summary: 'Create product with thumbnail and optional gallery images (Only Can Admin Do This)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Wireless Headphones' },
        description: { type: 'string', example: 'High quality headphone' },
        price: { type: 'number', example: 500 },
        discountPrice: { type: 'number', example: 450, nullable: true },
        stock: { type: 'number', example: 20 },
        categoryId: { type: 'string', example: 'abc123' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          example: ['new', 'tech'],
          nullable: true,
          description: 'Send multiple -F fields for each tag in curl',
        },
        productAdjective: {
          type: 'array',
          items: { type: 'string' },
          example: ['lightweight', 'durable'],
          nullable: true,
          description: 'Send multiple -F fields for each adjective in curl',
        },
        thumbnailImage: { type: 'string', format: 'binary' },
        galleryImages: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          nullable: true,
          description: 'Optional gallery images (multiple files allowed)',
        },
      },
      required: ['name', 'description', 'price', 'stock', 'thumbnailImage' , 'categoryId'],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnailImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 5 },
    ])
  )
  async createProductWithGallery(
    @Body() data: CreateProductDto,
    @UploadedFiles() files: { thumbnailImage?: Express.Multer.File[]; galleryImages?: Express.Multer.File[] }
  ) {

    const thumbnailImage = files.thumbnailImage?.[0];
    const galleryImages = files.galleryImages;

    if (!thumbnailImage) {
      throw new BadRequestException('Thumbnail image is required');
    }

    const result = await this.productService.createProduct(data, thumbnailImage, galleryImages);

    return {
      success: true,
      message: "Product created",
      data: result
    }
  }





}


