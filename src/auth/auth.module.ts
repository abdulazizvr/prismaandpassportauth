import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {APP_GUARD} from "@nestjs/core";
import {AccessTokenStrategy, RefreshTokenStrategy, RefreshTokenFromCookieStrategy} from "./strategies";
import {AccessTokenGuard} from "../common/guards";

@Module({
  imports:[JwtModule.register({}), forwardRef(() =>PrismaModule)],
  controllers: [AuthController],
  providers: [
      AuthService,
      AccessTokenStrategy,
      RefreshTokenFromCookieStrategy,
      RefreshTokenStrategy,
    {
      provide:APP_GUARD,
      useClass:AccessTokenGuard
    },
  ],
})
export class AuthModule {}
