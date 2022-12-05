import {Controller, Post, Get, Put, HttpCode, HttpStatus, Body, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() authDto:AuthDto):Promise<Tokens> {
        return this.authService.signup(authDto)
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() authDto:AuthDto) : Promise<Tokens> {
        return await this.authService.signin(authDto)
    }

    @Get('logout/:userId')
    @HttpCode(HttpStatus.OK)
    logout(@Param('id') userId :number) : Promise<Boolean> {
        return this.authService.logout(userId)
    }

}
