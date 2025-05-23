import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: 'Name of the folder' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'ID of the parent folder' })
  @IsUUID()
  @IsOptional()
  parentFolderId?: string;
}

export class UpdateFolderDto {
  @ApiProperty({ description: 'Updated name of the folder' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'ID of the new parent folder' })
  @IsUUID()
  @IsOptional()
  parentFolderId?: string;
}

export class FolderResponseDto {
  @ApiProperty({ description: 'Unique identifier of the folder' })
  id: string;

  @ApiProperty({ description: 'Name of the folder' })
  name: string;

  @ApiPropertyOptional({
    description: 'Parent folder information',
    type: 'object',
    nullable: true,
  })
  parentFolder?: any;

  @ApiProperty({
    description: 'Sub-folders contained in this folder',
    type: 'array',
  })
  subFolders: any[];

  @ApiProperty({
    description: 'Documents contained in this folder',
    type: 'array',
  })
  documents: any[];
}

export class FolderSuccessResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;
} 