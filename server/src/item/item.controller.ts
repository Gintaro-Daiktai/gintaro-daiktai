import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/createItem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createItem(@Body('item') createItemDto: CreateItemDto): Promise<any> {
    const newItem = await this.itemService.createItem(createItemDto);

    return {
      id: newItem.id,
      name: newItem.name,
      description: newItem.description,
      creation_date: newItem.creation_date,
      view_count: newItem.view_count,
      weight: newItem.weight,
      length: newItem.length,
      width: newItem.weight,
      height: newItem.height,
      condition: newItem.condition,
      user: newItem.user,
      itemTags: newItem.itemTags,
      images: newItem.images,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllItems(): Promise<any> {
    const items = await this.itemService.findAllItems();

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      creation_date: item.creation_date,
      view_count: item.view_count,
      weight: item.weight,
      length: item.length,
      width: item.weight,
      height: item.height,
      condition: item.condition,
      user: item.user,
      itemTags: item.itemTags,
      images: item.images,
      fk_lottery: item.fk_lottery,
      item_tags: item.itemTags,
      auction: item.auction,
      reviews: item.reviews,
    }));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteItem(@Param('id') id: string): Promise<any> {
    await this.itemService.deleteItem(parseInt(id, 10));
    return {
      message: 'Item deleted successfully',
    };
  }
}
