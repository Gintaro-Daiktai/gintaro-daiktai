import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { type Response } from 'express';

@Controller('images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(private readonly imageService: ImageService) {}

  @Get(':id')
  async getImage(@Param('id') id: number, @Res() res: Response) {
    const image = await this.imageService.findImageById(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    res.setHeader('Content-Type', image.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="image-${image.id}"`,
    );
    res.send(image.image);
  }
}
