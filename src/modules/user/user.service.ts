import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ERROR_MESSAGES } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinaryService: CloudinaryService) { }

    async deleteUser(userId: string) {
        const result = await this.prisma.user.delete({
            where: {
                id: userId
            }
        });

        if (!result) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

        return null;

    }

    async getSingleUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

        const { password, ...data } = user;

        return data;

    }

    async updateRole(userId: string, role: "CUSTOMER" | "ADMIN") {
        const result = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: role
            }
        });

        if (!result) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

        return result;

    }

    async getAllUser(page: number, limit: number, search: string) {
        const skip = (page - 1) * limit;

        const filter: any = {}

        if (search) {
            filter.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } }
            ]
        };

        const total = await this.prisma.user.count({
            where: filter
        });


        const data = await this.prisma.user.findMany({
            where: filter,
            take: limit,
            skip: skip,
            orderBy: {
                createdAt: "desc"
            }
        })

        return {
            meta: {
                skip,
                totalUser: total,
                limit,
                page,
                totalPage: Math.ceil(total / limit)
            },
            data
        }

    }

    async updateUserProfile(userId: string, data: UpdateUserDto, images: Express.Multer.File | undefined) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });


        if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

        const updatedData: any = {
            name: data?.name ? data.name : user?.name,
            phone: data.phone ? data.phone : user?.phone,
        }

        let uplodedImage: any;

        if (images) {
            uplodedImage = await this.cloudinaryService.uploadImageFromBuffer(images.buffer, "users", `profile-${userId}-${Date.now()}`);
            updatedData.profile = uplodedImage ? uplodedImage?.secure_url : user?.profile
        }

        const update = await this.prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
              ...updatedData
            }
        });
        return update;

    }
}
