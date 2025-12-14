import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImageEntity } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async createImage(image: Express.Multer.File): Promise<ImageEntity> {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }

    if (!image.mimetype.startsWith('image/')) {
      throw new BadRequestException('Invalid file type');
    }

    const imageEntity: ImageEntity = this.imageRepository.create({
      image: image.buffer,
      mimeType: image.mimetype,
    });

    return this.imageRepository.save(imageEntity);
  }

  async updateImage(
    id: number,
    image: Express.Multer.File,
  ): Promise<ImageEntity> {
    if (!image) {
      throw new BadRequestException('Image file is required.');
    }

    if (!image.mimetype.startsWith('image/')) {
      throw new BadRequestException('Invalid file type');
    }

    const imageEntity = await this.imageRepository.preload({
      id,
      image: image.buffer,
      mimeType: image.mimetype,
    });

    if (!imageEntity) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return this.imageRepository.save(imageEntity);
  }

  async findImageById(id: number): Promise<ImageEntity | null> {
    return await this.imageRepository.findOne({
      where: { id },
    });
  }
}
