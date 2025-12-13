import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ItemTagService } from './item_tag.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateItemTagDto } from './dto/createItemTag.dto';
import { ItemTagEntity } from './item_tag.entity';

@Controller('item-tags')
export class ItemTagController {
  private readonly logger = new Logger(ItemTagController.name);

  constructor(private readonly itemTagService: ItemTagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTag(
    @Body('item-tag') createItemTagDto: CreateItemTagDto,
  ): Promise<ItemTagEntity> {
    return this.itemTagService.createItemTag(createItemTagDto);
  }
}
