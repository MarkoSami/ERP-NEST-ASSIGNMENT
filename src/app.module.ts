import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FolderManagementModule } from './folder-management/folder-management.module';
import { TaggingModule } from './tagging/tagging.module';
import { AccessControlModule } from './access-control/access-control.module';
import { FileTypeValidationModule } from './file-type-validation/file-type-validation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'production' ? '/tmp/document-management.sqlite' : 'document-management.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Only auto-sync in development
      logging: process.env.NODE_ENV === 'development',
    }),
    FileUploadModule,
    FileTypeValidationModule,
    FolderManagementModule,
    TaggingModule,
    AccessControlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
