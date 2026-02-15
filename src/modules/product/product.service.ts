import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) { }

    async createProduct() { 
        
    }

}
