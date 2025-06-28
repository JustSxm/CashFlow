import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';

@Injectable()
export class MeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccounts(user: User, account: AccountDTO) {
    await this.prismaService.accounts.create({
      data: {
        user_id: user.id,
        name: account.accountName,
        type: account.type,
        balance: account.amount,
        limit: account.limit,
      },
    });
  }

  async getAccounts(user: any) {
    return await this.prismaService.accounts.findMany({
      where: {
        user_id: user.id,
      },
    });
  }
}
