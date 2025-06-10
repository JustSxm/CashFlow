// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/models';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<User | null> {
        const user = await this.usersService.findOne(username);
        if (!user) return null;

        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (!isMatch) return null;

        var result: User = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        return result;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userDto: any) {
        await this.usersService.register(userDto);
    }
}
