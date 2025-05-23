import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Permission, PermissionLevel } from '../models/permission.entity';
import { Document } from '../models/document.entity';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async grantPermission(
    documentId: string,
    userId: string,
    permissionLevel: PermissionLevel,
    groupId?: string,
  ): Promise<Permission> {
    // Verify document exists
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Check if permission already exists for this user/group on this document
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        document: { id: documentId },
        userId,
        groupId,
      },
    });

    if (existingPermission) {
      // Update existing permission
      existingPermission.level = permissionLevel;
      return this.permissionRepository.save(existingPermission);
    } else {
      // Create new permission
      const permission = new Permission();
      permission.document = document;
      permission.userId = userId;
      permission.level = permissionLevel;
      
      if (groupId) {
        permission.groupId = groupId;
      }

      return this.permissionRepository.save(permission);
    }
  }

  async removePermission(permissionId: string): Promise<boolean> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    await this.permissionRepository.remove(permission);
    return true;
  }

  async getDocumentPermissions(documentId: string): Promise<Permission[]> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return this.permissionRepository.find({
      where: {
        document: { id: documentId },
      },
    });
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: {
        userId,
      },
      relations: ['document'],
    });
  }

  async getGroupPermissions(groupId: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: {
        groupId,
      },
      relations: ['document'],
    });
  }

  async checkUserPermission(
    documentId: string,
    userId: string,
    requiredLevel: PermissionLevel,
  ): Promise<boolean> {
    // Get all permissions for this user on the document
    const userPermissions = await this.permissionRepository.find({
      where: [
        { document: { id: documentId }, userId },
        { document: { id: documentId }, groupId: Not(IsNull()) }, // Get group permissions as well
      ],
    });

    // Check if the user has the required permission level or higher
    const permissionLevels = Object.values(PermissionLevel);
    const requiredLevelIndex = permissionLevels.indexOf(requiredLevel);

    for (const permission of userPermissions) {
      const permissionLevelIndex = permissionLevels.indexOf(permission.level);
      if (permissionLevelIndex >= requiredLevelIndex) {
        return true;
      }
    }

    return false;
  }
} 