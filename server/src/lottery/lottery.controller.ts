import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateLotteryDto } from './dto/createLottery.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { LotteryEntity } from './lottery.entity';

@Controller('lotteries')
export class LotteryController {
  private readonly logger = new Logger(LotteryController.name);

  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createLottery(
    @Body('lottery') createLotteryDto: CreateLotteryDto,
    @User() user: UserPayload,
  ): Promise<LotteryEntity> {
    return this.lotteryService.createLottery(createLotteryDto, user);
  }

  @Get()
  async getLotteries(): Promise<LotteryEntity[]> {
    return this.lotteryService.findActiveLotteries();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelLottery(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayload: UserPayload,
  ): Promise<LotteryEntity> {
    return this.lotteryService.cancelLottery(id, userPayload);
  }
}
