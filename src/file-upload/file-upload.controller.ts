import { Controller, Post, Get, Delete, Param, UploadedFile, Body, UseInterceptors, BadRequestException, NotFoundException, Res, StreamableFile, Header } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './file-upload.service';
import { Document } from '../models/document.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileUploadDto, DocumentResponseDto } from '../dto/file-upload.dto';
import { SuccessResponseDto } from '../dto/common.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document file with metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: DocumentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or metadata' })
  @ApiResponse({ status: 415, description: 'Unsupported file type' })
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

  @Get(':id/download')
  @ApiOperation({ 
    summary: 'Download a document file',
    description: 'Downloads the actual file content for a document. The file will be served with appropriate headers including the original filename and content type.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the document to download', 
    type: 'string', 
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'File downloaded successfully. The response will be the file content with appropriate headers.',
    headers: {
      'Content-Type': {
        description: 'MIME type of the file',
        schema: { type: 'string', example: 'application/pdf' }
      },
      'Content-Disposition': {
        description: 'Indicates the file should be downloaded with original filename',
        schema: { type: 'string', example: 'attachment; filename="document.pdf"' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Document not found - The document with the specified ID does not exist',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Document with ID 123e4567-e89b-12d3-a456-426614174000 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - File system error or file corruption',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' }
      }
    }
  })
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const document = await this.fileUploadService.getDocument(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const filePath = join(process.cwd(), document.filePath);
    const file = createReadStream(filePath);

    res.set({
      'Content-Type': document.fileType,
      'Content-Disposition': `attachment; filename="${document.fileName}"`,
    });

    return new StreamableFile(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Document found', type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(@Param('id') id: string): Promise<Document> {
    const document = await this.fileUploadService.getDocument(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all documents' })
  @ApiResponse({ status: 200, description: 'List of all documents', type: [DocumentResponseDto] })
  async getAllDocuments(): Promise<Document[]> {
    return this.fileUploadService.getAllDocuments();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.fileUploadService.deleteDocument(id);
    if (!deleted) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return { success: true };
  }
} 