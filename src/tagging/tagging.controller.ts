import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { Tag } from '../models/tag.entity';
import { Document } from '../models/document.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateTagDto, UpdateTagDto, TagResponseDto, TagSuccessResponseDto } from '../dto/tag.dto';
import { DocumentResponseDto } from '../dto/file-upload.dto';

@ApiTags('tags')
@Controller('tags')
export class TaggingController {
  constructor(private readonly taggingService: TaggingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Tag created successfully', type: TagResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid tag data' })
  async createTag(@Body() body: CreateTagDto): Promise<Tag> {
    return this.taggingService.createTag(body.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'List of all tags', type: [TagResponseDto] })
  async getAllTags(): Promise<Tag[]> {
    return this.taggingService.getAllTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tag found', type: TagResponseDto })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async getTag(@Param('id', ParseUUIDPipe) id: string): Promise<Tag> {
    return this.taggingService.getTag(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: 200, description: 'Tag updated successfully', type: TagResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid update data' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async updateTag(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTagDto,
  ): Promise<Tag> {
    return this.taggingService.updateTag(id, body.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully', type: TagSuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async deleteTag(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.taggingService.deleteTag(id);
    return { success: true };
  }

  @Put('documents/:documentId/tag/:tagId')
  @ApiOperation({ summary: 'Add tag to document' })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'tagId', description: 'Tag ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tag added to document', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document or tag not found' })
  async addTagToDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<Document> {
    return this.taggingService.addTagToDocument(documentId, tagId);
  }

  @Delete('documents/:documentId/tag/:tagId')
  @ApiOperation({ summary: 'Remove tag from document' })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'tagId', description: 'Tag ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Tag removed from document', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document or tag not found' })
  async removeTagFromDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<Document> {
    return this.taggingService.removeTagFromDocument(documentId, tagId);
  }
} 