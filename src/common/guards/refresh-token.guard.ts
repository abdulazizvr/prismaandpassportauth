import { Reflector } from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
 
export class RefreshTokenGuard extends AuthGuard('refresh-jwt'){
    constructor(private reflector:Reflector) {
        super();
    }
}