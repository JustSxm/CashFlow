// auth.controller.ts
import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/models/models';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() user: UserDTO) {
        return this.authService.register(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('test')
    getProfile(@Request() req) {
        return {
            message: 'This route is protected with JWT',
            user: req.user,
        };
    }
}
