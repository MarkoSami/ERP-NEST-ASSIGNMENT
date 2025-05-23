import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../models/folder.entity';
import { Document } from '../models/document.entity';
import { FolderManagementService } from './folder-management.service';
import { FolderManagementController } from './folder-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, Document])],
  controllers: [FolderManagementController],
  providers: [FolderManagementService],
  exports: [FolderManagementService],
})
export class FolderManagementModule {} 