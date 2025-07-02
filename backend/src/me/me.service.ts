import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';
import { TransactionDTO, TransferDTO } from '@shared/Transaction';
import { TransactionTypes } from '@shared/TransactionTypes';
import { SettingsDTO } from '@shared/Settings';
import { Decimal } from '@prisma/client/runtime/library';

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
        amount: -transfer.amount, // Negative for transfer out
        type: TransactionTypes.TRANSFER,
        category: 'transfer',
        accountDestination: transfer.accountDestinationId,
      },
    });

    await this.prismaService.transactions.create({
      data: {
        vendor: 'Transfer',
        account_id: transfer.accountId!,
        amount: transfer.amount, // Positive for transfer in
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

  async updateTransfer(user, id: number, transferDto: TransferDTO) {
    // 1. Load primary transaction
    const primary = await this.prismaService.transactions.findFirst({
      where: { id, account: { user_id: user.id }, type: TransactionTypes.TRANSFER },
    });

    if (!primary) {
      throw new Error('Transfer not found');
    }

    const secondary = await this.prismaService.transactions.findFirst({
      where: {
        account_id: transferDto.accountId,
        accountDestination: transferDto.accountDestinationId,
        type: TransactionTypes.TRANSFER,
        amount: -primary.amount,
        id: {
          in: [primary.id + 1, primary.id - 1],
        },
      },
    });

    if (!secondary) {
      throw new Error('Paired transfer not found');
    }

    const isPrimaryLoss = primary.amount.toNumber() < 0;
    const rawAmount = transferDto.amount; // Always positive amount

    const newPrimaryAmount = isPrimaryLoss ? -rawAmount : +rawAmount;
    const newSecondaryAmount = isPrimaryLoss ? +rawAmount : -rawAmount;

    const deltaPrimary = newPrimaryAmount - primary.amount.toNumber();
    const deltaSecondary = newSecondaryAmount - secondary.amount.toNumber();

    await this.prismaService.transactions.update({
      where: { id: primary.id },
      data: { amount: newPrimaryAmount },
    });
    await this.prismaService.transactions.update({
      where: { id: secondary.id },
      data: { amount: newSecondaryAmount },
    });

    if (isPrimaryLoss) {
      await this.updateAccountBalance(user, primary.account_id, deltaPrimary);
      await this.updateAccountBalance(user, primary.accountDestination!, deltaSecondary);
    } else {
      await this.updateAccountBalance(user, primary.account_id, deltaSecondary);
      await this.updateAccountBalance(user, primary.accountDestination!, deltaPrimary);
    }

    return this.getTransactions(user);
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

  async getSettings(user: any) {
    return await this.prismaService.settings.findFirst({
      where: { user_id: user.id },
    });
  }
}
