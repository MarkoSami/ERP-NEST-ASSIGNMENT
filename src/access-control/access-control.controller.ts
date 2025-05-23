import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Permission, PermissionLevel } from '../models/permission.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { GrantPermissionDto, CheckPermissionDto, PermissionResponseDto, PermissionSuccessResponseDto, HasPermissionResponseDto } from '../dto/permission.dto';

@ApiTags('permissions')
@Controller('permissions')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post()
  @ApiOperation({ summary: 'Grant permission to a user or group for a document' })
  @ApiBody({ type: GrantPermissionDto })
  @ApiResponse({ status: 201, description: 'Permission granted successfully', type: PermissionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid permission data' })
  @ApiResponse({ status: 404, description: 'Document, user, or group not found' })
  async grantPermission(
    @Body() 
    body: GrantPermissionDto,
  ): Promise<Permission> {
    return this.accessControlService.grantPermission(
      body.documentId,
      body.userId,
      body.permissionLevel,
      body.groupId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a permission' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully', type: PermissionSuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async removePermission(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.accessControlService.removePermission(id);
    return { success: true };
  }

  @Get('document/:documentId')
  @ApiOperation({ summary: 'Get all permissions for a document' })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of permissions for the document', type: [PermissionResponseDto] })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentPermissions(
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getDocumentPermissions(documentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all permissions for a user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'List of permissions for the user', type: [PermissionResponseDto] })
  async getUserPermissions(
    @Param('userId') userId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getUserPermissions(userId);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all permissions for a group' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'List of permissions for the group', type: [PermissionResponseDto] })
  async getGroupPermissions(
    @Param('groupId') groupId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getGroupPermissions(groupId);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check if a user has the required permission for a document' })
  @ApiBody({ type: CheckPermissionDto })
  @ApiResponse({ status: 200, description: 'Permission check completed', type: HasPermissionResponseDto })
  async checkPermission(
    @Body() 
    body: CheckPermissionDto,
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.accessControlService.checkUserPermission(
      body.documentId,
      body.userId,
      body.requiredLevel,
    );
    return { hasPermission };
  }
} 