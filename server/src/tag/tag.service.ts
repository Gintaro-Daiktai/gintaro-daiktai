import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { In, Repository } from 'typeorm';
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

  async findTagsByIds(
    ids: number[],
    relations: Record<string, boolean> = {},
  ): Promise<TagEntity[]> {
    if (!ids || ids.length === 0) return [];

    const tags = await this.tagRepository.find({
      where: { id: In(ids) },
      relations,
    });

    if (tags.length !== ids.length) {
      const foundIds = tags.map((i) => i.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Tags not found: ${missingIds.join(', ')}`);
    }

    return tags;
  }

  async findTagByName(name: string): Promise<TagEntity | null> {
    return this.tagRepository.findOne({ where: { name } });
  }
}
