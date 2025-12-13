import {
  ConflictException,
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

    const items = await this.itemService.findItemsById(createLotteryDto.items);

    const alreadyAssigned = items.filter((item) => item.fk_lottery);
    if (alreadyAssigned.length > 0) {
      throw new ConflictException(
        `Items already assigned to another lottery: ${alreadyAssigned.map((i) => i.id).join(', ')}`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const lottery = manager.create(LotteryEntity, {
        ...createLotteryDto,
        user,
      });
      const savedLottery = await manager.save(lottery);

      items.forEach((item) => (item.fk_lottery = savedLottery.id));
      await manager.save(items);

      return savedLottery;
    });
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
}
