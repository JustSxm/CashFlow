import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '@shared/models';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(username: string) {
    return this.prismaService.users.findUnique({
      where: { username },
    });
  }

  async findById(id: number) {
    return this.prismaService.users.findUnique({
      where: { id },
    });
  }

  async login(userDto: UserDTO) {}
}
