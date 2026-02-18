import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class UpdateQuantityDto {
    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}