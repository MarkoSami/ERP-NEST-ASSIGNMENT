import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'File to upload' })
  file: Express.Multer.File;

  @ApiProperty({ description: 'Title of the document' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the document' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'ID of the parent folder' })
  @IsUUID()
  @IsOptional()
  folderId?: string;
}

export class DocumentResponseDto {
  @ApiProperty({ description: 'Unique identifier of the document' })
  id: string;

  @ApiProperty({ description: 'Title of the document' })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the document' })
  description?: string;

  @ApiProperty({ description: 'Original filename' })
  fileName: string;

  @ApiProperty({ description: 'Path where the file is stored' })
  filePath: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file' })
  fileType: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: Date;

  @ApiPropertyOptional({ description: 'Folder containing this document', type: 'object' })
  folder?: any;

  @ApiProperty({ description: 'Tags associated with this document', type: 'array' })
  tags: any[];
} 