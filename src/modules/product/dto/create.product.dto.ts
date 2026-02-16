import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateProductDto {

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

    @ApiProperty({ example: "abc123", required: true })
    @IsOptional()
    @IsString()
    categoryId?: string;


    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    tags?: string[];


    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    productAdjective?: string[];
}