import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ProductStatus } from "@prisma/client";

export class UpdateProductDto {

    @ApiProperty({ example: "Wireless Headphones" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: "High quality headphone" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 500 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @ApiProperty({ example: 450, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    discountPrice?: number;

    @ApiProperty({ example: 20 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stock: number;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    tags?: string[];


    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    productAdjective?: string[];

    @ApiProperty({ example: false })
    @IsBoolean()
    isFeatured: boolean

    @ApiProperty({
        enum: ProductStatus,
        example: ProductStatus.ACTIVE
    })
    @IsString()
    @IsEnum(ProductStatus)
    status: ProductStatus

    @ApiProperty({ example: ["product img link", "product img link"] })
    @IsOptional()
    @IsString()
    removeGalleryImage?: string[]

}