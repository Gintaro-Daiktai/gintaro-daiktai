import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from '../common/interfaces/user_payload.interface';
import { BrowseFiltersDto } from './dto/browseStatistics.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async getUserStatistics(@User() user: UserPayload, @Param('id') id: string) {
    const userId = parseInt(id, 10);

    if (user.userId !== userId && user.role !== 'admin') {
      throw new UnauthorizedException('You can only view your own statistics.');
    }

    return await this.statisticsService.getUserStatistics(userId);
  }

  @Get('auctions/list')
  @UseGuards(JwtAuthGuard)
  async getAuctionList(@User() user: UserPayload) {
    return await this.statisticsService.getAuctionsList(user.userId);
  }

  @Get('lotteries/list')
  @UseGuards(JwtAuthGuard)
  async getLotteriesList(@User() user: UserPayload) {
    return await this.statisticsService.getLotteriesList(user.userId);
  }

  @Get('auctions/:id')
  @UseGuards(JwtAuthGuard)
  async getAuctionStatistics(@Param('id') id: string) {
    const auctionId = parseInt(id, 10);
    return await this.statisticsService.getAuctionStatistics(auctionId);
  }

  @Get('lotteries/:id')
  @UseGuards(JwtAuthGuard)
  async getLotteryStatistics(@Param('id') id: string) {
    const lotteryId = parseInt(id, 10);
    return await this.statisticsService.getLotteryStatistics(lotteryId);
  }

  @Get('deliveries')
  @UseGuards(JwtAuthGuard)
  async getDeliveryStatistics(@User() user: UserPayload) {
    return await this.statisticsService.getDeliveryStatistics(user.userId);
  }

  @Get('browse')
  async getBrowseStatistics(
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('condition') condition?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    const filters: BrowseFiltersDto = {};

    if (minPrice) {
      filters.minPrice = parseFloat(minPrice);
    }
    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice);
    }
    if (condition) {
      filters.condition = condition as 'new' | 'used' | 'worn' | 'broken';
    }
    if (status) {
      filters.status = status as
        | 'ending soon'
        | 'new listing'
        | 'no bids'
        | 'no tickets sold';
    }
    if (category) {
      filters.category = category;
    }

    return await this.statisticsService.getBrowseStatistics(filters);
  }

  @Get('popular-tags')
  async getPopularTags(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.statisticsService.getPopularTags(limitNumber);
  }
}
