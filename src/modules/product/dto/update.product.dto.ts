import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ProductStatus } from "@prisma/client";

export class UpdateProductDto {

    @ApiProperty({ example: "Wireless Headphones" })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: "High quality headphone" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 500 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    price?: number;

    @ApiProperty({ example: 450, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    discountPrice?: number;

    @ApiProperty({ example: 20 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    tags?: string[];


    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    productAdjective?: string[];

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @Transform(({ value }) => value === "true" || value === true)
    @IsBoolean()
    isFeatured?: boolean;


    // @ApiProperty({
    //     enum: ProductStatus,
    //     example: ProductStatus.ACTIVE,
    //     required: false
    // })
    // @IsOptional()
    // @Transform(({ value }) => value?.toUpperCase())
    // @IsEnum(ProductStatus)
    // status?: ProductStatus;

    @ApiProperty({ example: ["product img link", "product img link"] })
    @IsOptional()
    @IsString()
    removeGalleryImage?: string[]

}