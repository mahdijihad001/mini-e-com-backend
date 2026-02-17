import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create.product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';
import { ProductStatus } from '@prisma/client';
import { UpdateProductDto } from './dto/update.product.dto';
import { ProductStatusDto } from './dto/productStatus.dto';

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
      required: ['name', 'description', 'price', 'stock', 'thumbnailImage', 'categoryId'],
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


  @Get(':id/single-product')
  @ApiOperation({ summary: 'Get single product by ID' })
  @ApiParam({ name: 'id', example: 'product-id-123' })
  async getSingleProduct(@Param('id') productId: string) {
    const resullt = await this.productService.getSingleProduct(productId);
    return {
      success: true,
      message: "Product retrived.",
      data: resullt
    }
  }


  @Get('all-product-list')
  @ApiOperation({ summary: 'Get all products with pagination, search, and status filter' })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'limit', example: 10 })
  @ApiQuery({ name: 'search', required: false, example: '' })
  @ApiQuery({ name: 'status', required: false, enum: ProductStatus, example: ProductStatus.ACTIVE })
  async getAllProducts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
  ) {
    const result = await this.productService.getAllProduct(page, limit, search, status);
    return {
      success: true,
      data: result
    }
  }


  @Delete(':id/delete-product')
  @ApiOperation({ summary: 'Delete product by ID (Only Can Do Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiParam({ name: 'id', example: 'product-id-123' })
  async deleteProduct(@Param('id') productId: string) {
    const result = await this.productService.deleteProduct(productId);
    return {
      success: true,
      message: "Product Deleted"
    }
  }


  @Patch("update/:id/product")
  @ApiOperation({ summary: "Update product (Only Can Admin do this)" })
  @ApiParam({ name: "id", example: "product-id" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: false,
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Wireless Headphones" },
        description: { type: "string", example: "High quality headphone" },
        price: { type: "number", example: 500 },
        discountPrice: { type: "number", example: 450 },
        stock: { type: "number", example: 20 },
        isFeatured: { type: "boolean", example: false },
        // status: {
        //   type: "string",
        //   enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
        //   example: "ACTIVE"
        // },
        tags: {
          type: "array",
          items: { type: "string" },
          example: ["electronics", "audio"]
        },
        productAdjective: {
          type: "array",
          items: { type: "string" },
          example: ["wireless", "noise-cancelling"]
        },
        removeGalleryImage: {
          type: "array",
          items: { type: "string" },
          example: ["https://image-link.com/image1.jpg"]
        },

        thumbnailImage: {
          type: "string",
          format: "binary"
        },

        galleryImages: {
          type: "array",
          items: {
            type: "string",
            format: "binary"
          }
        }
      }
    }
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: "thumbnailImage", maxCount: 1 }, { name: "galleryImages", maxCount: 5 }]))
  async updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto, @UploadedFiles() files: { thumbnailImage?: Express.Multer.File[], galleryImages?: Express.Multer.File[] }) {

    const thumbnail = files?.thumbnailImage?.[0];
    const galleryImages = files?.galleryImages;

    const result = await this.productService.updateProduct(id, dto, thumbnail, galleryImages);

    return {
      success: true,
      message: "Product updated",
      data: result
    }
  };


  @Patch("status/:proiductId/update")
  @ApiOperation({ summary: "Product Status update (Only Can Admin)" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiParam({ name: "proiductId", example: "product-id" })
  async updateProductStatus(@Body() data: ProductStatusDto, @Param("proiductId") proiductId: string) {

    if (!data.status) throw new BadRequestException("Status must be required");

    const result = await this.productService.updateProductStatus(proiductId, data.status);

    return {
      success: true,
      message: `${result.name} status has been updated to ${result.status}.`,
      data: result
    }
  }  

}


