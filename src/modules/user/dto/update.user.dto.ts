import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {

    @ApiProperty({
        example: "Mohammad Jihad"
    })
    @IsOptional()
    name: string

    @ApiProperty({
        example: "01783999926"
    })
    @IsOptional()
    phone: string


}