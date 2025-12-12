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

  async createTag(createTagDto: CreateTagDto): Promise<TagEntity> {
    const newItem = new TagEntity();

    Object.assign(newItem, createTagDto);

    return await this.tagRepository.save(newItem);
  }

  async findAllTags(): Promise<TagEntity[]> {
    return this.tagRepository.find();
  }

  async findTagById(id: number): Promise<TagEntity | null> {
    return this.tagRepository.findOne({ where: { id } });
  }

  async findTagByName(name: string): Promise<TagEntity | null> {
    return this.tagRepository.findOne({ where: { name } });
  }
}
