import { Injectable } from '@nestjs/common';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

@Injectable()
export class FileTypeValidationService {
  private readonly ALLOWED_MIME_TYPES = [
    'application/pdf',                                                       // PDF
    'application/msword',                                                    // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel',                                              // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',     // XLSX
    'application/vnd.ms-powerpoint',                                         // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'image/jpeg',                                                            // JPEG/JPG
    'image/png',                                                             // PNG
    'text/plain',                                                           // TXT
  ];

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  validateFile(mimeType: string, fileSize: number): ValidationResult {
    // Validate file type
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        isValid: false,
        message: `Unsupported file type: ${mimeType}. Allowed types: PDF, Word, Excel, PowerPoint, images, and text files.`,
      };
    }

    // Validate file size
    if (fileSize > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        message: `File size exceeds limit. Maximum allowed size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      };
    }

    return { isValid: true };
  }
} 