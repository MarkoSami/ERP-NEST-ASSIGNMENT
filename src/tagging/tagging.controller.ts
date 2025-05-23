import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { Tag } from '../models/tag.entity';
import { Document } from '../models/document.entity';

@Controller('tags')
export class TaggingController {
  constructor(private readonly taggingService: TaggingService) {}

  @Post()
  async createTag(@Body() body: { name: string }): Promise<Tag> {
    return this.taggingService.createTag(body.name);
  }

  @Get()
  async getAllTags(): Promise<Tag[]> {
    return this.taggingService.getAllTags();
  }

  @Get(':id')
  async getTag(@Param('id', ParseUUIDPipe) id: string): Promise<Tag> {
    return this.taggingService.getTag(id);
  }

  @Put(':id')
  async updateTag(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { name: string },
  ): Promise<Tag> {
    return this.taggingService.updateTag(id, body.name);
  }

  @Delete(':id')
  async deleteTag(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.taggingService.deleteTag(id);
    return { success: true };
  }

  @Put('documents/:documentId/tag/:tagId')
  async addTagToDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<Document> {
    return this.taggingService.addTagToDocument(documentId, tagId);
  }

  @Delete('documents/:documentId/tag/:tagId')
  async removeTagFromDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<Document> {
    return this.taggingService.removeTagFromDocument(documentId, tagId);
  }
} 