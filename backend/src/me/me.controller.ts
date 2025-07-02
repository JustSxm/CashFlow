import { Controller, Post, UseGuards, Request, Get, Delete, Param, ParseIntPipe, Body, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeService } from './me.service';
import { TransactionDTO, TransferDTO } from '@shared/Transaction';
import { AccountDTO } from '@shared/Account';
import { SettingsDTO } from '@shared/Settings';

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

  @Post('settings')
  async settings(@Request() req, @Body() settings: SettingsDTO) {
    const user = req.user;

    await this.meService.updateSettings(user, settings);
  }

  @Get('settings')
  async getSettings(@Request() req) {
    const user = req.user;
    return this.meService.getSettings(user);
  }

  @Post('transfer')
  async transfer(@Request() req, @Body() transfer: TransferDTO) {
    const user = req.user;

    await this.meService.createTransfer(user, transfer);
  }

  @Put('transfer/:id')
  async updateTransfer(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() transfer: TransferDTO) {
    const user = req.user;

    await this.meService.updateTransfer(user, id, transfer);
    return await this.meService.getTransactions(user);
  }
}
