import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createUser(data: { username: string; passwordHash: string }) {
    return this.users.create({
      data: {
        username: data.username,
        password_hash: data.passwordHash,
      },
    });
  }

  async createRefreshToken(data: { userId: number; token: string; expiresAt: Date }) {
    return this.refresh_tokens.create({
      data: {
        user_id: data.userId,
        token: data.token,
        expires_at: data.expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.refresh_tokens.findUnique({
      where: { token },
    });
  }

  async deleteExpiredRefreshTokens(now: Date) {
    return this.refresh_tokens.deleteMany({
      where: {
        expires_at: {
          lt: now,
        },
      },
    });
  }
}
