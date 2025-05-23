import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Folder, folder => folder.subFolders, { nullable: true })
  parentFolder: Folder;

  @OneToMany(() => Folder, folder => folder.parentFolder)
  subFolders: Folder[];

  @OneToMany(() => Document, document => document.folder)
  documents: Document[];
} 