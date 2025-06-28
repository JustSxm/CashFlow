import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeService } from './me.service';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private meService: MeService) {}

  @Post('transactions')
  async transactions(@Request() req) {
    console.log('Transactions request received');
  }

  @Post('accounts')
  async accounts(@Request() req) {
    const user = req.user;
    const accounts = req.body;

    await this.meService.createAccounts(user, accounts);
  }

  @Get('accounts')
  async getAccounts(@Request() req) {
    const user = req.user;
    return this.meService.getAccounts(user);
  }
}
