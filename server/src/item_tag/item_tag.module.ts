import { Module } from '@nestjs/common';
import { ItemTagController } from './item_tag.controller';
import { ItemTagService } from './item_tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemTagEntity } from './item_tag.entity';
import { TagModule } from 'src/tag/tag.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([ItemTagEntity]), ItemModule, TagModule],
  controllers: [ItemTagController],
  providers: [ItemTagService],
  exports: [ItemTagService],
})
export class ItemTagModule {}
