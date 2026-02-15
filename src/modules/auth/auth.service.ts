import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from "@nestjs/jwt"
import { ERROR_MESSAGES } from 'src/common/constants';
import { SignInDto } from './dto/sign.in.dto';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/config/env.config';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService) { };

    async generateTokens(userId: string, email: string, role: string) {
        const accessToekn = await this.jwtService.signAsync(
            { sub: userId, email: email, role },
            {
                secret: this.configService.get<IEnv>("env")?.JWT.JWT_SECRET,
                expiresIn: "7d"
            }
        );

        const refreshToken = await this.jwtService.signAsync(
            { sub: userId, email, role },
            {
                secret: this.configService.get<IEnv>("env")?.JWT.JWT_REFRESH_SECRET,
                expiresIn: "30d"
            }
        );

        return { accessToekn, refreshToken }
    };

    async updateRt(userId: string, token: string) {

        const hash = await bcrypt.hash(token, 10);

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: hash
            }
        });
    }

    async singUp(data: SignUpDto) {
        const existUer = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (existUer) throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_EXISTS);

        const hashPassword = await bcrypt.hash(data.password, 10);

        const result = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashPassword,
                phone: data.phone
            }
        });

        return result;

    };

    async signIn(data: SignInDto) {
        const findUser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (!findUser) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

        const compairePassword = await bcrypt.compare(data.password, findUser.password);

        if (!compairePassword) throw new BadRequestException("Invalid Password");

        const tokens = await this.generateTokens(findUser.id, findUser.email, findUser.role);

        await this.updateRt(findUser.id, tokens.refreshToken);

        const { password, ...user } = findUser;

        return {
            user,
            tokens: tokens
        }

    }

    async generateAccessTokenWitRefreshToken(token: string) {
        const payload = await this.jwtService.verify(token, {
            secret: this.configService.get<IEnv>("env")?.JWT.JWT_REFRESH_SECRET
        });

        if (!payload) throw new NotFoundException("Invalid Refresh Token");

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });

        if (!user || !user.refreshToken) {
            throw new BadRequestException("Invalid Refresh Token");
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        
        return tokens.accessToekn;

    }

}
