import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create.product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) { }

    async createProduct(data: CreateProductDto, thumbnailImage: Express.Multer.File, galleryImages?: Express.Multer.File[] | undefined) {

        const findCategory = await this.prisma.category.findUnique({
            where: {
                id: data.categoryId
            }
        });

        if (!findCategory) throw new NotFoundException("Category not found");

        const uplodedThumbnailImage: any = await this.cloudinary.uploadImageFromBuffer(thumbnailImage.buffer, "product", `product-${Date.now()}-${Math.random()}`);

        let galleryImg: string[] = [];

        if (galleryImages && galleryImages.length > 0) {
            galleryImg = await Promise.all(
                galleryImages.map(async (item) => {
                    const uplodImg: any = await this.cloudinary.uploadImageFromBuffer(item.buffer, "product", `product-img-gallery-${Date.now()}-${Math.random()}`);
                    return uplodImg.secure_url;
                })
            )
        };


        const tags = data.tags?.filter((t) => t && t.trim() !== '') || [];
        const adjectives = data.productAdjective?.filter((a) => a && a.trim() !== '') || [];

        const result = await this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                discountPrice: Number(data.discountPrice),
                stock: data.stock,
                categoryId: data.categoryId,
                thumbnail: uplodedThumbnailImage.secure_url,
                tags: tags,
                productAdjective: adjectives,
                galleryImages: galleryImg ? galleryImg : []
            }
        });

        return result;

    }

    async getSingleProduct(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) throw new NotFoundException("Product Not found");
        return product;
    }

    async getAllProduct(page: number, limit: number, search?: string, status?: "ACTIVE" | "DRAFT" | "ARCHIVED") {

        const skip = (page - 1) * limit;

        const filter: any = {}

        if (status) filter.status = status

        if (search) {
            filter.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ]
        }

        const total = await this.prisma.product.count({ where: filter });

        const result = await this.prisma.product.findMany({
            where: filter
        });

        return {
            meta: {
                total,
                page,
                limit,
                skip,
                totalPage: Math.ceil(total / limit)
            },
            data: result
        }

    }

    async deleteProduct(productId: string) {
        const result = await this.prisma.product.delete({
            where: {
                id: productId
            }
        });
        if (!result) throw new NotFoundException("Product not found");
        return result;
    };

    

}
