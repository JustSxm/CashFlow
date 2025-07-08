// auth.controller.ts
import { Controller, Post, UseGuards, Req, Body, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '@shared/models';
import { LocalAuthGuard } from './local-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';

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
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, username } = await this.authService.login(req.user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { username, accessToken };
  }

  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('Refreshing access token');
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const { access_token, refresh_token } = await this.authService.getNewAccessToken(refreshToken);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }
}
