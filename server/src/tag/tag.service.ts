import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/createTag.dto';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async createItem(createTagDto: CreateTagDto): Promise<TagEntity> {
    const newItem = new TagEntity();

    Object.assign(newItem, createTagDto);

    return await this.tagRepository.save(newItem);
  }

  async findAllTags(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  async findOneByName(name: string): Promise<TagEntity | null> {
    return await this.tagRepository.findOne({ where: { name } });
  }
}
