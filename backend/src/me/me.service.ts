import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';
import { TransactionDTO } from '@shared/Transaction';
import { TransactionTypes } from '@shared/TransactionTypes';

@Injectable()
export class MeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(user: User, account: AccountDTO) {
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

  async createTransaction(user: User, transaction: TransactionDTO) {
    await this.prismaService.transactions.create({
      data: {
        vendor: transaction.vendor,
        account_id: transaction.accountId,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
      },
    });

    let editAmount = transaction.amount;
    if (transaction.type === TransactionTypes.EXPENSE) {
      editAmount = -transaction.amount;
    }

    await this.updateAccountBalance(user, transaction.accountId, editAmount);
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

  async deleteTransaction(user: any, id: number) {
    const transaction = await this.prismaService.transactions.findFirst({
      where: {
        id: id,
        account: {
          user_id: user.id,
        },
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.prismaService.transactions.delete({
      where: { id: id },
    });

    // Update the account balance after deleting the transaction
    let editAmount = transaction.amount;
    if (transaction.type === TransactionTypes.EXPENSE) {
      editAmount = transaction.amount.negated();
    }

    await this.updateAccountBalance(user, transaction.account_id, Number(editAmount));
  }

  async updateTransaction(user: any, id: number, transaction: TransactionDTO) {
    await this.prismaService.$transaction(async (prisma) => {
      const existingTransaction = await prisma.transactions.findFirst({
        where: {
          id: id,
          account: {
            user_id: user.id,
          },
        },
      });

      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      // Update the transaction
      await prisma.transactions.update({
        where: { id: id },
        data: {
          vendor: transaction.vendor,
          account_id: transaction.accountId,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
        },
      });

      // Adjust the account balance
      let editAmount = transaction.amount;
      if (transaction.type === TransactionTypes.EXPENSE) {
        editAmount = -transaction.amount;
      }

      await this.updateAccountBalance(user, transaction.accountId, editAmount);
    });

    return await this.getTransactions(user);
  }
}
