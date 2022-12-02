import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService  extends PrismaClient implements OnModuleInit,OnModuleDestroy
{
    constructor() {
        super({
            datasources:{
                db:{
                    url:`postgresql://postgres:checkhack__01@localhost:5000/nest-prisma?schema=public`
                },
            }
        })
    }
    async onModuleInit() {
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }

}
