import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/createItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UpdateItemDto } from './dto/editItem.dto';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  async createItem(
    createItemDto: CreateItemDto,
    userPayload: UserPayload,
  ): Promise<ItemEntity> {
    const { tagIds, ...itemData } = createItemDto;

    const user = await this.userService.findUserById(userPayload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    let tagData = {};

    if (tagIds !== undefined) {
      const tags = await this.tagService.findTagsByIds(tagIds);
      tagData = { tags };
    }

    const newItem = this.itemRepository.create({
      ...itemData,
      user,
      ...tagData,
    });

    return this.itemRepository.save(newItem);
  }

  async updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity> {
    const { tagIds, ...itemData } = updateItemDto;

    let tagData = {};

    if (tagIds !== undefined) {
      const tags = await this.tagService.findTagsByIds(tagIds);
      tagData = { tags };
    }

    const item = await this.itemRepository.preload({
      ...itemData,
      ...tagData,
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${updateItemDto.id} not found`);
    }

    return this.itemRepository.save(item);
  }

  async findItemsByUser(userPayload: UserPayload): Promise<ItemEntity[]> {
    const user = await this.userService.findUserById(userPayload.userId);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${userPayload.userId} not found`,
      );
    }

    return this.itemRepository.find({
      where: { user },
      relations: { tags: true },
    });
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

  async deleteItem(id: number, userPayload: UserPayload): Promise<void> {
    const item = await this.findItemById(id);
    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    const isOwner = item.user?.id === userPayload.userId;
    const isAdmin = userPayload.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this item.',
      );
    }

    await this.itemRepository.remove(item);
  }
}
