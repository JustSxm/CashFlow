import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MeController } from './me/me.controller';
import { MeService } from './me/me.service';
import { MeModule } from './me/me.module';

const isDevelopment = process.env.NODE_ENV === 'development';

const throttle = isDevelopment ? [] : [ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 60 }] })];

const throttleProviders = isDevelopment ? [] : [{ provide: APP_GUARD, useClass: ThrottlerGuard }];

@Module({
  imports: [...throttle, ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsersModule, AuthModule, MeModule],
  controllers: [],
  providers: [...throttleProviders, MeService],
})
export class AppModule {}
