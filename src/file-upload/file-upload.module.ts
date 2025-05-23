import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../models/document.entity';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileTypeValidationModule } from '../file-type-validation/file-type-validation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    FileTypeValidationModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {} 