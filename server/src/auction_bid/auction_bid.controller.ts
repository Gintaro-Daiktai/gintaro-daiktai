import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuctionBidService } from './auction_bid.service';
import { CreateAuctionBidDto } from './dto/createAuctionBid.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmedGuard } from 'src/auth/guards/confirmed.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { AuctionBidEntity } from './auction_bid.entity';

@Controller('auction-bids')
export class AuctionBidController {
  private readonly logger = new Logger(AuctionBidController.name);

  constructor(private readonly auctionBidService: AuctionBidService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async createAuctionBid(
    @Body('auction_bid') createAuctionBidDto: CreateAuctionBidDto,
    @User() userPayload: UserPayload,
  ): Promise<AuctionBidEntity> {
    return this.auctionBidService.createAuctionBid(
      createAuctionBidDto,
      userPayload,
    );
  }
}
