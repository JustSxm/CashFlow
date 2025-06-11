import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const isDevelopment = process.env.NODE_ENV === 'development';

const throttle = isDevelopment ? [] : [ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 60 }] })];

const throttleProviders = isDevelopment ? [] : [{ provide: APP_GUARD, useClass: ThrottlerGuard }];

@Module({
  imports: [...throttle, ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsersModule, AuthModule],
  controllers: [],
  providers: [...throttleProviders],
})
export class AppModule {}
