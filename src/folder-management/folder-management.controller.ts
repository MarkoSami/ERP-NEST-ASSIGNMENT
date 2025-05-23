import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { FolderManagementService } from './folder-management.service';
import { Folder } from '../models/folder.entity';
import { Document } from '../models/document.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateFolderDto, UpdateFolderDto, FolderResponseDto, FolderSuccessResponseDto } from '../dto/folder.dto';
import { DocumentResponseDto } from '../dto/file-upload.dto';

@ApiTags('folders')
@Controller('folders')
export class FolderManagementController {
  constructor(private readonly folderService: FolderManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiBody({ type: CreateFolderDto })
  @ApiResponse({ status: 201, description: 'Folder created successfully', type: FolderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid folder data' })
  async createFolder(
    @Body() body: CreateFolderDto,
  ): Promise<Folder> {
    return this.folderService.createFolder(body.name, body.parentFolderId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all folders' })
  @ApiResponse({ status: 200, description: 'List of all folders', type: [FolderResponseDto] })
  async getAllFolders(): Promise<Folder[]> {
    return this.folderService.getAllFolders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Folder found', type: FolderResponseDto })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async getFolder(@Param('id', ParseUUIDPipe) id: string): Promise<Folder> {
    return this.folderService.getFolder(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a folder' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateFolderDto })
  @ApiResponse({ status: 200, description: 'Folder updated successfully', type: FolderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid update data' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async updateFolder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateFolderDto,
  ): Promise<Folder> {
    return this.folderService.updateFolder(id, body.name, body.parentFolderId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a folder' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Folder deleted successfully', type: FolderSuccessResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - cannot delete folder with contents' })
  @ApiResponse({ status: 404, description: 'Folder not found' })
  async deleteFolder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.folderService.deleteFolder(id);
    return { success: true };
  }

  @Put(':folderId/documents/:documentId')
  @ApiOperation({ summary: 'Add document to folder' })
  @ApiParam({ name: 'folderId', description: 'Folder ID', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Document added to folder', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document or folder not found' })
  async addDocumentToFolder(
    @Param('folderId', ParseUUIDPipe) folderId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Document> {
    return this.folderService.addDocumentToFolder(documentId, folderId);
  }

  @Delete('documents/:documentId')
  @ApiOperation({ summary: 'Remove document from folder' })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Document removed from folder', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async removeDocumentFromFolder(
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Document> {
    return this.folderService.removeDocumentFromFolder(documentId);
  }
} 