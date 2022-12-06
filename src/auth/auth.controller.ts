import {Controller, Post, Get, Put, HttpCode, HttpStatus, Body, Param, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/';
import { Tokens } from './types';
import {GetCurrentUser, GetCurrentUserId, Public} from "../common/decorators";
import {RefreshTokenGuard} from "../common/guards";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) { }

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() authDto:AuthDto):Promise<Tokens> {
        return this.authService.signup(authDto)
    }

    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() authDto:AuthDto) : Promise<Tokens> {
        return await this.authService.signin(authDto)
    }


    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(
        @GetCurrentUserId() userId:number,
        @Res({passthrough:true}) res,
    ) : Promise<Boolean> {
        res.clearCookie('refresh_token')
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens (
        @GetCurrentUserId() userId:number,
        @GetCurrentUser('refreshToken') refreshToken:string,
    ):Promise<Tokens> {
        console.log(refreshToken)
        return this.authService.refreshTokens(userId, refreshToken)
    }

}
