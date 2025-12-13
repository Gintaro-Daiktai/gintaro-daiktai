import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ConfirmedGuard } from 'src/auth/guards/confirmed.guard';
import { CreateAuctionDto } from './dto/createAuction.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { AuctionResponseDto } from './dto/AuctionResponseDto';

@Controller('auctions')
export class AuctionController {
  private readonly logger = new Logger(AuctionController.name);

  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async createAuction(
    @Body('auction') createAuctionDto: CreateAuctionDto,
    @User() user: UserPayload,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.createAuction(createAuctionDto, user);
  }

  @Get()
  async getAllAuctions(): Promise<AuctionResponseDto[]> {
    return this.auctionService.findAllAuctions({
      user: true,
      item: true,
    });
  }

  @Get(':id')
  async getAuction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuctionResponseDto> {
    const auction = await this.auctionService.findAuctionById(id, {
      user: true,
      item: true,
      auctionBids: true,
    });

    if (!auction) {
      throw new NotFoundException(`Auction with id '${id}' not found`);
    }

    return auction;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async cancelAuction(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayload,
  ): Promise<AuctionResponseDto> {
    return this.auctionService.cancelAuction(id, user);
  }
}
