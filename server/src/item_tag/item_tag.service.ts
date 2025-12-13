import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemTagEntity } from './item_tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { TagService } from 'src/tag/tag.service';
import { CreateItemTagDto } from './dto/createItemTag.dto';

@Injectable()
export class ItemTagService {
  private readonly logger = new Logger(ItemTagService.name);

  constructor(
    @InjectRepository(ItemTagEntity)
    private readonly itemTagRepository: Repository<ItemTagEntity>,
    private readonly itemService: ItemService,
    private readonly tagService: TagService,
  ) {}

  async createItemTag(
    createItemTagDto: CreateItemTagDto,
  ): Promise<ItemTagEntity> {
    const item = await this.itemService.findItemById(createItemTagDto.item);
    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    const tag = await this.tagService.findTagById(createItemTagDto.tag);
    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }

    const newItem = this.itemTagRepository.create({
      tag,
      item,
    });

    return this.itemTagRepository.save(newItem);
  }
}
