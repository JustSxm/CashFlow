import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async createUser(data: { username: string; email: string; passwordHash: string }) {
        return this.users.create({
            data: {
                username: data.username,
                email: data.email,
                password_hash: data.passwordHash,
            },
        });
    }
}
