import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuctionBidService } from './auction_bid.service';
import { CreateAuctionBidDto } from './dto/createAuctionBid.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmedGuard } from 'src/auth/guards/confirmed.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { AuctionBidResponseDto } from './dto/AuctionBidResponseDto';
import { plainToInstance } from 'class-transformer';

@Controller('auction-bids')
export class AuctionBidController {
  private readonly logger = new Logger(AuctionBidController.name);

  constructor(private readonly auctionBidService: AuctionBidService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async createAuctionBid(
    @Body('auction_bid') createAuctionBidDto: CreateAuctionBidDto,
    @User() userPayload: UserPayload,
  ): Promise<AuctionBidResponseDto> {
    const bid = await this.auctionBidService.createAuctionBid(
      createAuctionBidDto,
      userPayload,
    );
    return plainToInstance(AuctionBidResponseDto, bid, {
      excludeExtraneousValues: true,
    });
  }
}
