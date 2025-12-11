import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { LotteryEntity } from './lottery.entity';
import { CreateLotteryDto } from './dto/createLottery.dto';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { DataSource } from 'typeorm';

@Injectable()
export class LotteryService {
  private readonly logger = new Logger(LotteryService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
}
