// import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Request } from "express";
// import { ERROR_MESSAGES } from "../constants";

import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ERROR_MESSAGES } from "../constants";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request: Request & { user: any } = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) throw new BadRequestException("You must be logged in to access this route");
        if (user.role !== "ADMIN" || user.role !== "SUPER_ADMIN") throw new BadRequestException(ERROR_MESSAGES.UNAUTHORIZED);
        return true
    }
}
