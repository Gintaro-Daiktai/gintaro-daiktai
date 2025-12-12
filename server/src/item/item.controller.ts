import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Logger,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/createItem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { ItemEntity } from './item.entity';
import { UpdateItemDto } from './dto/editItem.dto';

@Controller('items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createItem(
    @Body('item') createItemDto: CreateItemDto,
    @User() userPayload: UserPayload,
  ): Promise<ItemEntity> {
    const newItem = await this.itemService.createItem(
      createItemDto,
      userPayload,
    );

    return newItem;
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Body('item') updateItemDto: UpdateItemDto,
  ): Promise<ItemEntity> {
    return this.itemService.updateItem(updateItemDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllItems(): Promise<ItemEntity[]> {
    const items = await this.itemService.findAllItems();

    return items;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteItem(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayload: UserPayload,
  ): Promise<void> {
    return this.itemService.deleteItem(id, userPayload);
  }
}
