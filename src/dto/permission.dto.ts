import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PermissionLevel } from '../models/permission.entity';

export class GrantPermissionDto {
  @ApiProperty({ description: 'ID of the document' })
  @IsUUID()
  documentId: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: 'Permission level',
    enum: PermissionLevel,
    example: PermissionLevel.VIEW
  })
  @IsEnum(PermissionLevel)
  permissionLevel: PermissionLevel;

  @ApiPropertyOptional({ description: 'ID of the group (optional)' })
  @IsString()
  @IsOptional()
  groupId?: string;
}

export class CheckPermissionDto {
  @ApiProperty({ description: 'ID of the document' })
  @IsUUID()
  documentId: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: 'Required permission level',
    enum: PermissionLevel,
    example: PermissionLevel.EDIT
  })
  @IsEnum(PermissionLevel)
  requiredLevel: PermissionLevel;
}

export class PermissionResponseDto {
  @ApiProperty({ description: 'Unique identifier of the permission' })
  id: string;

  @ApiProperty({ description: 'ID of the user' })
  userId: string;

  @ApiPropertyOptional({ description: 'ID of the group', nullable: true })
  groupId?: string;

  @ApiProperty({ 
    description: 'Permission level',
    enum: PermissionLevel
  })
  level: PermissionLevel;

  @ApiProperty({ description: 'Document information', type: 'object' })
  document: any;
}

export class PermissionSuccessResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;
}

export class HasPermissionResponseDto {
  @ApiProperty({ description: 'Whether the user has the required permission', example: true })
  hasPermission: boolean;
} 