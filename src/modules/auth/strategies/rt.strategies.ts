// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Request } from "express";
// import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IEnv } from "src/config/env.config";


// @Injectable()
// export class RtStrategies extends PassportStrategy(Strategy, "rt-jwt") {
//     constructor() {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: "rt-secrate",
//             passReqToCallback: true
//         })
//     };

//     async validate(req: Request, payload: any) {
//         const refreshToken = req.get("authorization")?.replace("Bearer ", "").trim();
//         // const refreshToken = req.headers.authorization?.replace("Bearer ", "").trim();

//         return {
//             userId: payload.sub,
//             refreshToken
//         }

//     }
// }

@Injectable()
export class RtStrategies extends PassportStrategy(Strategy, "rt-jwt") {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<IEnv>("env")?.JWT.JWT_REFRESH_SECRET as string,
            passReqToCallback: true
        })
    };

    async validate(req: Request, payload: any) {
        const refreshToken = req.get("authoraization")?.replace("Bearer ", "").trim();

        return {
            userId: payload.sub,
            refreshToken
        }

    }

}