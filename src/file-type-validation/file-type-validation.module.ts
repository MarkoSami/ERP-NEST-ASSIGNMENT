import { Module } from '@nestjs/common';
import { FileTypeValidationService } from './file-type-validation.service';

@Module({
  providers: [FileTypeValidationService],
  exports: [FileTypeValidationService],
})
export class FileTypeValidationModule {} 