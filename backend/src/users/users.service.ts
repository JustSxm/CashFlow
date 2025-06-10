import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/models/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}
    async register(userDto: UserDTO) {
        this.prismaService.createUser({
            username: userDto.username,
            email: userDto.email,
            passwordHash: await this.hashPassword(userDto.password),
        });
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async findOne(username: string) {
        return this.prismaService.users.findUnique({
            where: { username },
        });
    }

    async login(userDto: UserDTO) {}
}
