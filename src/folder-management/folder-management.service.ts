import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../models/folder.entity';
import { Document } from '../models/document.entity';

@Injectable()
export class FolderManagementService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async createFolder(name: string, parentFolderId?: string): Promise<Folder> {
    const folder = new Folder();
    folder.name = name;

    // Set parent folder if provided
    if (parentFolderId) {
      const parentFolder = await this.folderRepository.findOne({
        where: { id: parentFolderId },
      });

      if (!parentFolder) {
        throw new NotFoundException(`Parent folder with ID ${parentFolderId} not found`);
      }

      folder.parentFolder = parentFolder;
    }

    return this.folderRepository.save(folder);
  }

  async getFolder(folderId: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['parentFolder', 'subFolders', 'documents'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    return folder;
  }

  async getAllFolders(): Promise<Folder[]> {
    return this.folderRepository.find({
      relations: ['parentFolder', 'subFolders', 'documents'],
    });
  }

  async updateFolder(folderId: string, name: string, parentFolderId?: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['parentFolder'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    folder.name = name;

    // Update parent folder if provided
    if (parentFolderId) {
      // Prevent circular references
      if (parentFolderId === folderId) {
        throw new BadRequestException('A folder cannot be its own parent');
      }

      const parentFolder = await this.folderRepository.findOne({
        where: { id: parentFolderId },
      });

      if (!parentFolder) {
        throw new NotFoundException(`Parent folder with ID ${parentFolderId} not found`);
      }

      folder.parentFolder = parentFolder;
    } else {
      folder.parentFolder = null;
    }

    return this.folderRepository.save(folder);
  }

  async deleteFolder(folderId: string): Promise<boolean> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['subFolders', 'documents'],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    // Check if folder has subfolders or documents
    if (folder.subFolders.length > 0 || folder.documents.length > 0) {
      throw new BadRequestException('Cannot delete folder with subfolders or documents');
    }

    await this.folderRepository.remove(folder);
    return true;
  }

  async addDocumentToFolder(documentId: string, folderId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    document.folder = folder;
    return this.documentRepository.save(document);
  }

  async removeDocumentFromFolder(documentId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['folder'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    document.folder = null;
    return this.documentRepository.save(document);
  }
} 