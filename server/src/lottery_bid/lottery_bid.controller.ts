import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { LotteryBidService } from './lottery_bid.service';
import { CreateLotteryBidDto } from './dto/createLotteryBid.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';

@Controller('lottery-bids')
export class LotteryBidController {
  private readonly logger = new Logger(LotteryBidController.name);

  constructor(private readonly lotteryBidService: LotteryBidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createLotteryBid(
    @Body('lottery_bid') createLotteryBidDto: CreateLotteryBidDto,
    @User() userPayload: UserPayload,
  ): Promise<any> {
    const newBid = await this.lotteryBidService.createLotteryBid(
      createLotteryBidDto,
      userPayload,
    );

    return newBid;
  }
}
