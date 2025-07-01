import { Injectable } from '@nestjs/common';
import { User } from '@shared/models';
import { PrismaService } from 'prisma/prisma.service';
import { AccountDTO } from '@shared/Account';
import { TransactionDTO } from '@shared/Transaction';
import { TransactionTypes } from '@shared/TransactionTypes';
import { SettingsDTO } from '@shared/Settings';

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
    if (transaction.type == TransactionTypes.TRANSFER) {
      this.createTransferTransaction(user, transaction);
      return;
    }

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
        accountDestination: transaction.accountDestinationId,
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

  async createTransferTransaction(user: User, transaction: TransactionDTO) {
    if (transaction.type === TransactionTypes.TRANSFER && !transaction.accountDestinationId) {
      throw new Error('Transfer transactions must have a destination account');
    }

    const sourceAccount = await this.prismaService.accounts.findFirst({
      where: {
        user_id: user.id,
        id: transaction.accountId,
      },
    });

    const destinationAccount = await this.prismaService.accounts.findFirst({
      where: {
        user_id: user.id,
        id: transaction.accountDestinationId,
      },
    });

    if (!sourceAccount || !destinationAccount) {
      throw new Error('Source or destination account not found');
    }

    // Create the transfer transaction for the source account
    await this.prismaService.transactions.create({
      data: {
        vendor: transaction.vendor,
        account_id: transaction.accountId,
        amount: -transaction.amount, // Negative for transfer out
        type: TransactionTypes.TRANSFER,
        category: transaction.category,
        accountDestination: transaction.accountDestinationId,
      },
    });

    // Create the transfer transaction for the destination account
    await this.prismaService.transactions.create({
      data: {
        vendor: transaction.vendor,
        account_id: transaction.accountDestinationId!,
        amount: transaction.amount, // Positive for transfer in
        type: TransactionTypes.TRANSFER,
        category: transaction.category,
        accountDestination: transaction.accountId,
      },
    });

    // Update the balances of both accounts
    await this.updateAccountBalance(user, transaction.accountId, -transaction.amount);
    await this.updateAccountBalance(user, transaction.accountDestinationId!, transaction.amount);
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
