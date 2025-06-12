// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDTO } from 'src/models/models';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(userDto: UserDTO) {
    this.prismaService.createUser({
      username: userDto.username,
      passwordHash: await this.hashPassword(userDto.password),
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) return null;

    var result: User = {
      id: user.id,
      username: user.username,
    };

    return result;
  }

  async login(user: User) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.deleteExpiredRefreshTokens();

    return {
      username: user.username,
      accessToken,
      refreshToken,
    };
  }

  async deleteExpiredRefreshTokens() {
    const now = new Date();
    await this.prismaService.deleteExpiredRefreshTokens(now);
  }

  async getPayloadFromUser(user: User): Promise<{ username: string; sub: number }> {
    return { username: user.username, sub: user.id };
  }

  async createAccessToken(user: User) {
    const payload = await this.getPayloadFromUser(user);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_JWT_KEY'),
      expiresIn: '1h',
    });
  }

  async createRefreshToken(user: User) {
    const payload = await this.getPayloadFromUser(user);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_REFRESH_JWT_KEY'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prismaService.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return refreshToken;
  }

  async getNewAccessToken(refresh_token: string) {
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('SECRET_REFRESH_JWT_KEY'),
      });

      const storedRefreshToken = await this.prismaService.findRefreshToken(refresh_token);
      if (!storedRefreshToken || storedRefreshToken.expires_at < new Date()) {
        throw new Error();
      }

      const user = await this.usersService.findById(decoded.sub);
      if (!user) {
        throw new Error();
      }

      const newAccessToken = await this.createAccessToken(user);
      const newRefreshToken = await this.createRefreshToken(user);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
