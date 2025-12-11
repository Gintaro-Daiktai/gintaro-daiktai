import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/createItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly userService: UserService,
  ) {}

  async createItem(
    createItemDto: CreateItemDto,
    userPayload: UserPayload,
  ): Promise<ItemEntity> {
    const user = await this.userService.findUserById(userPayload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newItem = this.itemRepository.create({
      ...createItemDto,
      user,
    });

    return this.itemRepository.save(newItem);
  }

  async findAllItems(): Promise<ItemEntity[]> {
    return await this.itemRepository.find();
  }

  async findItemById(id: number): Promise<ItemEntity | null> {
    return await this.itemRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findItemsById(
    ids: number[],
    relations: Record<string, boolean> = {},
  ): Promise<ItemEntity[]> {
    if (!ids || ids.length === 0) return [];

    const items = await this.itemRepository.find({
      where: { id: In(ids) },
      relations,
    });

    if (items.length !== ids.length) {
      const foundIds = items.map((i) => i.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Items not found: ${missingIds.join(', ')}`);
    }

    return items;
  }

  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete({ id });
  }
}
