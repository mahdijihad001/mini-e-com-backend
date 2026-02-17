import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddToCartDto {
    @ApiProperty({ example: "Product Id" })
    @IsNotEmpty()
    @IsString()
    productId: string
}