import { Controller, Post, Get, Delete, Param, UploadedFile, Body, UseInterceptors, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './file-upload.service';
import { Document } from '../models/document.entity';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: { title: string; description?: string; folderId?: string },
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    try {
      return await this.fileUploadService.uploadDocument(file, metadata);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<Document> {
    const document = await this.fileUploadService.getDocument(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  @Get()
  async getAllDocuments(): Promise<Document[]> {
    return this.fileUploadService.getAllDocuments();
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.fileUploadService.deleteDocument(id);
    if (!deleted) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return { success: true };
  }
} 