import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../models/tag.entity';
import { Document } from '../models/document.entity';
import { TaggingService } from './tagging.service';
import { TaggingController } from './tagging.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Document])],
  controllers: [TaggingController],
  providers: [TaggingService],
  exports: [TaggingService],
})
export class TaggingModule {} 