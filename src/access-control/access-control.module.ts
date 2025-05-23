import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../models/permission.entity';
import { Document } from '../models/document.entity';
import { AccessControlService } from './access-control.service'
import { AccessControlController } from './access-control.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Document])],
  controllers: [AccessControlController],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {} 