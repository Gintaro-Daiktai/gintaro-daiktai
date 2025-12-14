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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/createItem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { ItemEntity } from './item.entity';
import { UpdateItemDto } from './dto/editItem.dto';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ParseJsonPipe } from 'src/common/pipes/parse-json.pipe';
import { validateOrReject } from 'class-validator';
@Controller('items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createItem(
    @Body('item') item: string,
    @User() userPayload: UserPayload,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ItemEntity> {
    const createItemDto = plainToInstance(CreateItemDto, JSON.parse(item));
    await validateOrReject(createItemDto);
    const itemEntity = await this.itemService.createItem(
      createItemDto,
      userPayload,
      image,
    );
    return plainToInstance(ItemEntity, itemEntity);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body('item', ParseJsonPipe) updateItemDto: UpdateItemDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ItemEntity> {
    const item = await this.itemService.updateItem(id, updateItemDto, image);
    return plainToInstance(ItemEntity, item);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getItems(@User() userPayload: UserPayload): Promise<ItemEntity[]> {
    const items = await this.itemService.findItemsByUser(userPayload);
    return plainToInstance(ItemEntity, items);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemEntity | null> {
    const item = await this.itemService.findItemById(id);

    if (!item) throw new NotFoundException(`Item with id '${id}' not found`);

    return plainToInstance(ItemEntity, item);
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
