import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
