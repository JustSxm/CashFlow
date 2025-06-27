import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  @Post('transactions')
  async transactions(@Request() req) {
    console.log('Transactions request received');
  }
}
