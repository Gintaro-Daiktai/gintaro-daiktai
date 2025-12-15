import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LotteryBidEntity } from './lottery_bid.entity';
import { Repository } from 'typeorm';
import { CreateLotteryBidDto } from './dto/createLotteryBid.dto';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';
import { LotteryService } from 'src/lottery/lottery.service';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class LotteryBidService {
  private readonly logger = new Logger(LotteryBidService.name);

  constructor(
    @InjectRepository(LotteryBidEntity)
    private readonly lotteryBidRepository: Repository<LotteryBidEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly lotteryService: LotteryService,
  ) {}

  async createLotteryBid(
    createLotteryBidDto: CreateLotteryBidDto,
    userPayload: UserPayload,
  ): Promise<LotteryBidEntity> {
    const user = await this.userService.findUserById(userPayload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const lottery = await this.lotteryService.findLotteryById(
      createLotteryBidDto.lottery,
    );
    if (!lottery) {
      throw new NotFoundException('Lottery not found.');
    }

    if (
      user.balance <
      lottery.ticket_price * createLotteryBidDto.ticket_count
    ) {
      throw new BadRequestException(
        `Insufficient balance. Required: $${lottery.ticket_price * createLotteryBidDto.ticket_count}, Available: ${user.balance}`,
      );
    }

    user.balance -= lottery.ticket_price * createLotteryBidDto.ticket_count;
    await this.userRepository.save(user);

    const newLotteryBid = this.lotteryBidRepository.create({
      ...createLotteryBidDto,
      lottery,
      bid_date: new Date(),
      user,
    });

    return this.lotteryBidRepository.save(newLotteryBid);
  }

  async findLotteryBidsByLotteryId(
    lotteryId: number,
  ): Promise<LotteryBidEntity[]> {
    const lottery = await this.lotteryService.findLotteryById(lotteryId);

    if (!lottery)
      throw new NotFoundException(`No lottery with ID ${lotteryId}.`);

    return await this.lotteryBidRepository.find({
      where: { lottery: { id: lotteryId } },
      relations: { user: true },
    });
  }
}
