import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Document, document => document.tags)
  documents: Document[];
} 