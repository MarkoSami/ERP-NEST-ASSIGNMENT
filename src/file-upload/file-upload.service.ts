import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../models/document.entity';
import * as fs from 'fs';
import * as path from 'path';
import { FileTypeValidationService } from '../file-type-validation/file-type-validation.service';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private fileValidationService: FileTypeValidationService,
  ) {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async uploadDocument(
    file: Express.Multer.File,
    metadata: {
      title: string;
      description?: string;
      folderId?: string;
    },
  ): Promise<Document> {
    // Validate file type using the validation service
    const validationResult = this.fileValidationService.validateFile(file.mimetype, file.size);
    
    if (!validationResult.isValid) {
      throw new Error(validationResult.message);
    }

    // Create document entity
    const document = new Document();
    document.title = metadata.title;
    document.description = metadata.description;
    document.fileName = file.originalname;
    document.fileSize = file.size;
    document.fileType = file.mimetype;
    document.filePath = file.path;

    // Save the document to the database
    return this.documentRepository.save(document);
  }

  async getDocument(documentId: string): Promise<Document> {
    return this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['folder', 'tags'],
    });
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.find({
      relations: ['folder', 'tags'],
    });
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    const document = await this.documentRepository.findOne({ where: { id: documentId } });
    
    if (!document) {
      return false;
    }

    // Delete the physical file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete from database
    await this.documentRepository.remove(document);
    return true;
  }

  async checkFileExists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }
} 