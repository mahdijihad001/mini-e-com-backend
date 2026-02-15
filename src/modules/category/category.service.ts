import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ERROR_MESSAGES } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) { }

    async createCategory(name: string, image: Express.Multer.File) {

        const existCategory = await this.prisma.category.findUnique({
            where: {
                name: name
            }
        });

        if (existCategory) throw new BadRequestException("Category Already Exist");


        const uplodedImage: any = await this.cloudinary.uploadImageFromBuffer(image.buffer, "category", `category-${Date.now()}`);

        const createCategory = await this.prisma.category.create({
            data: {
                name: name,
                image: uplodedImage.secure_url
            }
        });

        if (!createCategory) throw new BadRequestException("Category creation faild");

        return createCategory;

    };

    async getAllCategory() {
        const result = await this.prisma.category.findMany({});
        return result;
    }

    async findSingleCategory(categoryId: string) {
        const result = await this.prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });

        if (!result) throw new NotFoundException(ERROR_MESSAGES.RECORD_NOT_FOUND);

        return result;

    }

    async updateCategory(categoryId: string, name: string, image: Express.Multer.File | undefined) {

        if (!name && !image) throw new BadRequestException("At last one fild (name or image) must be provide for update");

        const findCategory = await this.prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });

        if (!findCategory) throw new NotFoundException("Category Not Found");

        let uploadedImage: any;

        if (image) {
            uploadedImage = await this.cloudinary.uploadImageFromBuffer(image.buffer, "category", `category-${Date.now()}`)
        }


        const update = await this.prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name: name ? name : findCategory.name,
                image: uploadedImage ? uploadedImage?.secure_url : findCategory.image
            }
        });

        return update;

    }

    async deleteCategory(categoryId: string) {

        const result = await this.prisma.category.delete({
            where: {
                id: categoryId
            }
        });

        if (!result) throw new NotFoundException("Category Not found");

        return result;
    }

}
