import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/createTag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { TagEntity } from './tag.entity';

@Controller('tags')
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createTag(@Body('tag') createTagDto: CreateTagDto): Promise<TagEntity> {
    const tagAlreadyExists =
      (await this.tagService.findTagByName(createTagDto.name)) != null;

    if (tagAlreadyExists) {
      throw new ConflictException(
        `Tag with name '${createTagDto.name}' already exists.`,
      );
    }

    return this.tagService.createTag(createTagDto);
  }

  @Get()
  async getAllTags(): Promise<TagEntity[]> {
    const tags = await this.tagService.findAllTags();

    return tags;
  }
}
