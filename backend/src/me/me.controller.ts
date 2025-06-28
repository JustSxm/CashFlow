import { Controller, Post, UseGuards, Request, Get, Delete, Param, ParseIntPipe, Body, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeService } from './me.service';
import { TransactionDTO } from '@shared/Transaction';
import { AccountDTO } from '@shared/Account';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private meService: MeService) {}

  @Post('transactions')
  async transactions(@Request() req, @Body() transaction: TransactionDTO) {
    const user = req.user;

    await this.meService.createTransaction(user, transaction);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    const user = req.user;
    return this.meService.getTransactions(user);
  }

  @Delete('transactions/:id')
  async deleteTransactions(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;

    await this.meService.deleteTransaction(user, id);
    return await this.meService.getTransactions(user);
  }

  @Put('transactions/:id')
  async updateTransaction(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() transaction: TransactionDTO) {
    const user = req.user;

    await this.meService.updateTransaction(user, id, transaction);
    return await this.meService.getTransactions(user);
  }

  @Post('accounts')
  async accounts(@Request() req, @Body() account: AccountDTO) {
    const user = req.user;

    await this.meService.createAccount(user, account);
  }

  @Get('accounts')
  async getAccounts(@Request() req) {
    const user = req.user;
    return this.meService.getAccounts(user);
  }
}
