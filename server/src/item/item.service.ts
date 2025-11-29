import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/createItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly userService: UserService,
  ) {}
  async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
    const newItem = new ItemEntity();

    Object.assign(newItem, createItemDto);

    const user = await this.userService.findUserById(createItemDto.user_id);
    if (!user) throw new NotFoundException('User not found.');
    newItem.user = user;

    newItem.creation_date = new Date();
    newItem.view_count = 0;

    return await this.itemRepository.save(newItem);
  }

  async findAllItems(): Promise<ItemEntity[]> {
    return await this.itemRepository.find();
  }

  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete({ id });
  }
}
