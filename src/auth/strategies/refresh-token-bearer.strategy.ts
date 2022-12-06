import {ForbiddenException, Injectable} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Request} from "express";
import {ExtractJwt,Strategy} from "passport-jwt";
import {JwtPayload, JwtPayloadWithRefreshToken} from "../types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy 
(Strategy,'refresh-jwt')
{
    constructor() {
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.REFRESH_TOKEN_KEY,
            passReqToCallback:true
        });
    }
    validate(req:Request,payload:JwtPayload): JwtPayloadWithRefreshToken {
        const authHeader = req.headers.authorization
        const refreshToken = authHeader.split(' ')[1]

        if(!refreshToken) throw new ForbiddenException('Refresh Token is incorrect')
        return {
            ...payload,
            refreshToken
        }
    }
}
