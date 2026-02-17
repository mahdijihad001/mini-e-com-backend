import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PlaceOrderDto {

    @ApiProperty({ example: 50000 })
    @IsNumber()
    @IsNotEmpty()
    totalAmount: string

}