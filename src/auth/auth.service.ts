import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import * as bcrypt from 'bcryptjs'
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private  prismaService:PrismaService,
        private  jwtService:JwtService
    ) {}

    async signup(authDto:AuthDto): Promise<Tokens>{
        const candidate = await this.prismaService.user.findUnique({
            where:{
                email:authDto.email
            }
        })
        if(candidate) {
            throw new BadRequestException('Bunday email mavjud')
        }
        const HashedPassword = await bcrypt.hash(authDto.password,7)
        const newUser = await this.prismaService.user.create({
            data:{
                email:authDto.email,
                HashedPassword
            }
        })
        const tokens = await this.getTokens(newUser.id,newUser.email)
        await this.updateRefreshTokenHash(newUser.id,tokens.refresh_token)
        return tokens
    }

    async getTokens(userId:number,email:string):Promise<Tokens> {
        const jwtPayload:JwtPayload = {
            sub:userId,
            email:email
        }
        const [accessToken,refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload,{
                secret:process.env.ACCESS_TOKEN_KEY,
                expiresIn:process.env.ACCESS_TOKEN_TIME
            }),
            this.jwtService.signAsync(jwtPayload,{
                secret:process.env.ACCESS_TOKEN_KEY,
                expiresIn:process.env.ACCESS_TOKEN_TIME
            })
        ])
        return {
            access_token:accessToken,
            refresh_token:refreshToken
        }
    }

    async updateRefreshTokenHash(userId:number,refreshToken:string):Promise<void>{
        const hashedRefreshToken = await bcrypt.hash(refreshToken,7)
        await this.prismaService.user.update({
            where:{
                id:userId
            },
            data:{
                hashedRefreshToken:hashedRefreshToken
            }
        })
    }
}
