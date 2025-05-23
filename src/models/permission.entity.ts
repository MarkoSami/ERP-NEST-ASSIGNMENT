import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Document } from './document.entity';

export enum PermissionLevel {
  VIEW = 'view',
  EDIT = 'edit',
  DOWNLOAD = 'download',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  groupId: string;

  @Column({
    type: 'simple-enum',
    enum: PermissionLevel,
    default: PermissionLevel.VIEW,
  })
  level: PermissionLevel;

  @ManyToOne(() => Document)
  document: Document;
} 