// auth.controller.ts
import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '@shared/models';
import { LocalAuthGuard } from './local-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 1, ttl: 300000 } })
  @Post('register')
  async register(@Body() user: UserDTO) {
    return this.authService.register(user);
  }

  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.getNewAccessToken(body.refresh_token);
  }
}
