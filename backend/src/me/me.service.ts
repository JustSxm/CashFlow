import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';
import { TransactionDTO } from '@shared/Transaction';
import { TransactionTypes } from '@shared/TransactionTypes';

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

  async getAccounts(user: User) {
    return await this.prismaService.accounts.findMany({
      where: {
        user_id: user.id,
      },
    });
  }

  async createTransactions(user: User, transactions: TransactionDTO) {
    await this.prismaService.transactions.create({
      data: {
        vendor: transactions.vendor,
        account_id: transactions.accountId,
        amount: transactions.amount,
        type: transactions.type,
        category: transactions.category,
      },
    });

    let editAmount = transactions.amount;
    if (transactions.type === TransactionTypes.EXPENSE) {
      editAmount = -transactions.amount;
    }

    await this.updateAccountBalance(user, transactions.accountId, editAmount);
  }

  async updateAccountBalance(user: User, accountId: number, editAmount: number) {
    const account = await this.prismaService.accounts.findFirst({
      where: {
        user_id: user.id,
        id: accountId,
      },
    });

    if (account) {
      const newBalance = account.balance.plus(editAmount);
      await this.prismaService.accounts.update({
        where: { id: accountId },
        data: { balance: newBalance },
      });
    } else {
      throw new Error('Account not found');
    }
  }

  async getTransactions(user: User) {
    return await this.prismaService.transactions.findMany({
      where: {
        account: {
          user_id: user.id,
        },
      },
      include: {
        account: true,
      },
    });
  }
}
