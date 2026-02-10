import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class SignUpDto {
    @ApiProperty({ example: 'Mohammad Jihad' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'user@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '0178221212121' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: '12345678' })
    @IsNotEmpty()
    @IsString()
    password: string;

};