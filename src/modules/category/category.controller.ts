import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guards';
import { AdminGuard } from 'src/common/guards/jwt.admin.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: "Create Category (Only Can Admin)"
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Electronics',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createCategory(
    @Body('name') name: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = await this.categoryService.createCategory(name, image);

    return {
      success: true,
      message: "Category Created",
      data: result
    }
  }


  @Get("all-category-list")
  @ApiOperation({
    summary: "All Categosy List"
  })
  async allCategoryList() {
    const result = await this.categoryService.getAllCategory();

    return {
      success: true,
      message: "All category list retrived successfully",
      data: result
    }

  }

  @Get(":categoryId/find-single-category")
  @ApiParam({ name: "categoryId", required: true, example: "1sfe2eade2eqqedadadad" })
  async FindSingleCategory(@Param("categoryId") categoryId: string) {

    const result = await this.categoryService.findSingleCategory(categoryId);

    return {
      success: true,
      message: "Category retrived successfully",
      data: result
    }
  }

  @Delete(":categoryId/category-delete")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiParam({ name: "categoryId", required: true, example: "1sfe2eade2eqqedadadad" })
  @ApiOperation({ summary: "Category Delete (Only Can Admin)" })
  async deleteCategory(@Param("categoryId") categoryId: string) {

    const result = await this.categoryService.deleteCategory(categoryId);

    return {
      success: true,
      message: "Category Deleted",
      data: result
    }
  }


  @Patch(':id/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({
    summary: "Category Update (Only Can Admin)"
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Category ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Updated Electronics',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateCategory(
    @Param('id') id: string,
    @Body('name') name: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.categoryService.updateCategory(id, name, image);

    return {
      success: true,
      message: "Category Update Successfully",
      data: result
    }

  }

}
