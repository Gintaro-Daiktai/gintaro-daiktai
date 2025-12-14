import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LotteryEntity } from './lottery.entity';
import { CreateLotteryDto } from './dto/createLottery.dto';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class LotteryService {
  private readonly logger = new Logger(LotteryService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(LotteryEntity)
    private readonly lotteryRepository: Repository<LotteryEntity>,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
  ) {}

  async createLottery(
    createLotteryDto: CreateLotteryDto,
    userPayload: UserPayload,
  ): Promise<LotteryEntity> {
    const user = await this.userService.findUserById(userPayload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const items = await this.itemService.findItemsById(
      createLotteryDto.itemIds,
    );

    const alreadyAssigned = items.filter((item) => item.lottery);
    if (alreadyAssigned.length > 0) {
      throw new ConflictException(
        `Items already assigned to another lottery: ${alreadyAssigned.map((i) => i.id).join(', ')}`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const lottery = manager.create(LotteryEntity, {
        ...createLotteryDto,
        lottery_status: 'created',
        user,
      });
      const savedLottery = await manager.save(lottery);

      items.forEach((item) => (item.lottery = savedLottery));
      await manager.save(items);

      return savedLottery;
    });
  }

  async findActiveLotteries(): Promise<LotteryEntity[]> {
    return (
      await this.lotteryRepository.find({
        relations: { items: true },
      })
    ).filter(
      (lottery) =>
        lottery.lottery_status != 'cancelled' &&
        lottery.lottery_status != 'finished',
    );
  }

  async findLotteryById(
    id: number,
    relations: Record<string, boolean> = {},
  ): Promise<LotteryEntity | null> {
    return (await this.findLotteriesById([id], relations))[0] ?? null;
  }

  async findLotteriesById(
    ids: number[],
    relations: Record<string, boolean> = {},
  ): Promise<LotteryEntity[]> {
    if (!ids || ids.length === 0) return [];

    const lotteries = await this.lotteryRepository.find({
      where: { id: In(ids) },
      relations,
    });

    if (lotteries.length !== ids.length) {
      const foundIds = lotteries.map((i) => i.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Lotteries not found: ${missingIds.join(', ')}`,
      );
    }

    return lotteries;
  }

  async cancelLottery(
    id: number,
    userPayload: UserPayload,
  ): Promise<LotteryEntity> {
    const lottery = await this.lotteryRepository.findOne({
      where: { id },
      relations: { user: true, items: true },
    });

    if (!lottery) {
      throw new NotFoundException(`Lottery with id ${id} not found.`);
    }

    if (lottery.user.id !== userPayload.userId) {
      throw new ForbiddenException(
        'You do not have permission to cancel this lottery.',
      );
    }

    if (lottery.lottery_status === 'cancelled') {
      throw new ConflictException('Lottery is already cancelled.');
    }

    if (lottery.lottery_status === 'finished') {
      throw new ConflictException('Cannot cancel a sold lottery.');
    }

    lottery.lottery_status = 'cancelled';

    return this.dataSource.transaction(async (manager) => {
      lottery.items.forEach((item) => {
        item.lottery = null;
        manager.save(item);
      });

      return manager.save(lottery);
    });
  }
}
