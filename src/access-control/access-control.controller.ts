import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Permission, PermissionLevel } from '../models/permission.entity';

@Controller('permissions')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post()
  async grantPermission(
    @Body() 
    body: { 
      documentId: string; 
      userId: string; 
      permissionLevel: PermissionLevel;
      groupId?: string;
    },
  ): Promise<Permission> {
    return this.accessControlService.grantPermission(
      body.documentId,
      body.userId,
      body.permissionLevel,
      body.groupId,
    );
  }

  @Delete(':id')
  async removePermission(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.accessControlService.removePermission(id);
    return { success: true };
  }

  @Get('document/:documentId')
  async getDocumentPermissions(
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getDocumentPermissions(documentId);
  }

  @Get('user/:userId')
  async getUserPermissions(
    @Param('userId') userId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getUserPermissions(userId);
  }

  @Get('group/:groupId')
  async getGroupPermissions(
    @Param('groupId') groupId: string,
  ): Promise<Permission[]> {
    return this.accessControlService.getGroupPermissions(groupId);
  }

  @Post('check')
  async checkPermission(
    @Body() 
    body: { 
      documentId: string; 
      userId: string; 
      requiredLevel: PermissionLevel;
    },
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.accessControlService.checkUserPermission(
      body.documentId,
      body.userId,
      body.requiredLevel,
    );
    return { hasPermission };
  }
} 