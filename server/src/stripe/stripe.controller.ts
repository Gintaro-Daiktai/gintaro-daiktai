import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/CreateCheckoutSessionDto';
import { CreateWithdrawalDto } from './dto/CreateWithdrawalDto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import type { RawBodyRequest } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @User() user: UserPayload,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const clientSecret = await this.stripeService.createCheckoutSession(
      user.userId,
      createCheckoutSessionDto.amount,
    );
    return { clientSecret };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.stripeService.handleWebhook(
      req.rawBody as Buffer,
      signature,
    );
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async processWithdrawal(
    @User() user: UserPayload,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ) {
    return await this.stripeService.processWithdrawal(
      user.userId,
      createWithdrawalDto.amount,
    );
  }

  @Get('session/:sessionId')
  @UseGuards(JwtAuthGuard)
  async getSessionStatus(@Param('sessionId') sessionId: string) {
    return await this.stripeService.getCheckoutSessionStatus(sessionId);
  }
}
