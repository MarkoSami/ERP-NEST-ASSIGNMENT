import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { FolderManagementService } from './folder-management.service';
import { Folder } from '../models/folder.entity';
import { Document } from '../models/document.entity';

@Controller('folders')
export class FolderManagementController {
  constructor(private readonly folderService: FolderManagementService) {}

  @Post()
  async createFolder(
    @Body() body: { name: string; parentFolderId?: string },
  ): Promise<Folder> {
    return this.folderService.createFolder(body.name, body.parentFolderId);
  }

  @Get()
  async getAllFolders(): Promise<Folder[]> {
    return this.folderService.getAllFolders();
  }

  @Get(':id')
  async getFolder(@Param('id', ParseUUIDPipe) id: string): Promise<Folder> {
    return this.folderService.getFolder(id);
  }

  @Put(':id')
  async updateFolder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { name: string; parentFolderId?: string },
  ): Promise<Folder> {
    return this.folderService.updateFolder(id, body.name, body.parentFolderId);
  }

  @Delete(':id')
  async deleteFolder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.folderService.deleteFolder(id);
    return { success: true };
  }

  @Put(':folderId/documents/:documentId')
  async addDocumentToFolder(
    @Param('folderId', ParseUUIDPipe) folderId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Document> {
    return this.folderService.addDocumentToFolder(documentId, folderId);
  }

  @Delete('documents/:documentId')
  async removeDocumentFromFolder(
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Document> {
    return this.folderService.removeDocumentFromFolder(documentId);
  }
} 