// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { IEnv } from "src/config/env.config";
// import { PrismaService } from "src/prisma/prisma.service";


// @Injectable()
// export class AtStrategie extends PassportStrategy(Strategy, "jwt") {
//     constructor(private Prisma: PrismaService, configService: ConfigService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService.get<IEnv>("env")?.JWT.JWT_SECRET as string
//         });
//     }

//     async validate(payload: any) {

//         const user = await this.Prisma.user.findUnique({
//             where: {
//                 id: payload.sub
//             }
//         });

//         if (!user) throw new UnauthorizedException();

//         return user
//     }

// }


import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ERROR_MESSAGES } from "src/common/constants";
import { IEnv } from "src/config/env.config";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AtStrategie extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<IEnv>("env")?.JWT.JWT_SECRET as string,
        })
    };

    async validate(paylod: any) {
        const findUser = await this.prisma.user.findUnique({
            where: {
                id: paylod.sub
            }
        });
        if (!findUser) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        const { password, ...user } = findUser;
        return user;
    }

}