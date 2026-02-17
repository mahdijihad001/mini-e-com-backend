import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddToCartDto {
    @ApiProperty({ example: "Product Id" })
    @IsNotEmpty()
    @IsString()
    productId: string

    @ApiProperty({ example: 500 })
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    quantity: number


}