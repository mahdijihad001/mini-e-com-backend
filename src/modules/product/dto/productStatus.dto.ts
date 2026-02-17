import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

export class ProductStatusDto {
    @ApiProperty({
        enum: ProductStatus,
        example: ProductStatus.ACTIVE,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum(ProductStatus)
    status?: ProductStatus;
}