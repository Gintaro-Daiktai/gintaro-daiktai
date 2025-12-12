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
  NotFoundException,
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
    return this.itemService.createItem(createItemDto, userPayload);
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
    return this.itemService.findAllItems();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemEntity | null> {
    const item = await this.itemService.findItemById(id);

    if (!item) throw new NotFoundException(`Item with id '${id}' not found`);

    return item;
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
