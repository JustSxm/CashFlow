import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';
import { Transaction, TransactionDTO, TransferDTO } from '@shared/Transaction';
import { TransactionTypes } from '@shared/TransactionTypes';
import { SettingsDTO } from '@shared/Settings';
import { AccountTypes } from '@shared/AccountTypes';

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
        limit: account.type === AccountTypes.CARD ? account.limit : null,
      },
    });
  }

  async updateAccount(user: User, id: number, account: AccountDTO) {
    const existingAccount = await this.prismaService.accounts.findFirst({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    if (!existingAccount) {
      throw new Error('Account not found');
    }

    await this.prismaService.accounts.update({
      where: { id: id },
      data: {
        name: account.accountName,
        type: account.type,
        balance: account.amount,
        limit: account.type === AccountTypes.CARD ? account.limit : null,
      },
    });

    return await this.getAccounts(user);
  }

  async getAccounts(user: User) {
    return await this.prismaService.accounts.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async deleteAccount(user: any, id: number) {
    const account = await this.prismaService.accounts.findFirst({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    await this.prismaService.transactions.deleteMany({
      where: {
        account_id: id,
      },
    });

    await this.prismaService.accounts.delete({
      where: { id: id },
    });
  }

  async createTransaction(user: User, transaction: TransactionDTO) {
    let money = transaction.amount;
    if (transaction.type === TransactionTypes.EXPENSE) {
      money = -transaction.amount;
    }

    await this.prismaService.transactions.create({
      data: {
        vendor: transaction.vendor,
        account_id: transaction.accountId,
        amount: money,
        type: transaction.type,
        category: transaction.category,
      },
    });

    let editAmount = transaction.amount;
    if (transaction.type === TransactionTypes.EXPENSE) {
      editAmount = -transaction.amount;
    }

    await this.updateAccountBalance(user, transaction.accountId, editAmount);

    const settings = await this.prismaService.settings.findFirst({
      where: { user_id: user.id },
    });

    if (settings && settings.saving_mode && transaction.type === TransactionTypes.INCOME) {
      const savingAmount = (transaction.amount * settings.percentage) / 100;
      await this.prismaService.transactions.create({
        data: {
          vendor: transaction.vendor,
          account_id: transaction.accountId,
          amount: -savingAmount, // Saving is considered an expense
          type: TransactionTypes.SAVING,
          category: transaction.category,
          accountDestination: null, // No destination for saving transactions
        },
      });
      await this.updateAccountBalance(user, transaction.accountId, -savingAmount);
    }
  }

  async createTransfer(user: any, transfer: TransferDTO) {
    await this.prismaService.transactions.create({
      data: {
        vendor: 'Transfer',
        account_id: transfer.accountId,
        amount: transfer.amount,
        type: TransactionTypes.TRANSFER,
        category: 'transfer',
        accountDestination: transfer.accountDestinationId,
      },
    });

    await this.updateAccountBalance(user, transfer.accountId, -transfer.amount);
    await this.updateAccountBalance(user, transfer.accountDestinationId!, transfer.amount);
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

    if (transaction.type === TransactionTypes.TRANSFER) {
      await this.undoTransfer(user, transaction);
      return;
    }

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

      // Update the new account balance
      await this.updateAccountBalance(user, transaction.accountId, transaction.amount);

      // Update the old account balance if the account has changed
      await this.updateAccountBalance(user, existingTransaction.account_id, -existingTransaction.amount);
    });

    return await this.getTransactions(user);
  }

  async undoTransfer(user: User, transaction: any) {
    await this.updateAccountBalance(user, transaction.account_id, transaction.amount);
    await this.updateAccountBalance(user, transaction.accountDestination!, -transaction.amount);
  }

  async updateTransfer(user, id: number, transferDto: TransferDTO) {
    const transaction = await this.prismaService.transactions.findFirst({
      where: { id, account: { user_id: user.id }, type: TransactionTypes.TRANSFER },
    });

    if (!transaction) {
      throw new Error('Transfer not found');
    }

    await this.undoTransfer(user, transaction);

    // Update transfer transaction
    await this.prismaService.transactions.update({
      where: { id },
      data: {
        vendor: 'Transfer',
        account_id: transferDto.accountId,
        amount: transferDto.amount,
        type: TransactionTypes.TRANSFER,
        category: 'transfer',
        accountDestination: transferDto.accountDestinationId,
      },
    });

    // Apply new transfer
    await this.updateAccountBalance(user, transferDto.accountId, -transferDto.amount);
    await this.updateAccountBalance(user, transferDto.accountDestinationId!, transferDto.amount);
  }

  async updateSettings(user: any, settings: SettingsDTO) {
    await this.prismaService.settings.upsert({
      where: { user_id: user.id },
      update: {
        saving_mode: settings.savingMode,
        percentage: settings.percentage,
        start_of_the_week: settings.startOfTheWeek,
        default_dashboard_view: settings.defaultDashboardView,
      },
      create: {
        user_id: user.id,
        saving_mode: settings.savingMode,
        percentage: settings.percentage,
        start_of_the_week: settings.startOfTheWeek,
        default_dashboard_view: settings.defaultDashboardView,
      },
    });
  }

  async getSettings(user: User) {
    let settings = await this.prismaService.settings.findFirst({
      where: { user_id: user.id },
    });

    if (!settings) {
      await this.prismaService.settings.create({
        data: {
          user_id: user.id,
          saving_mode: false,
          percentage: 10,
          start_of_the_week: 1,
          default_dashboard_view: 1,
        },
      });
    } else {
      return settings;
    }

    settings = await this.prismaService.settings.findFirst({
      where: { user_id: user.id },
    });

    return settings;
  }
}
