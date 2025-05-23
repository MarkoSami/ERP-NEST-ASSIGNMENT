import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Folder } from './folder.entity';
import { Tag } from './tag.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @Column()
  fileType: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @ManyToOne(() => Folder, folder => folder.documents, { nullable: true })
  folder: Folder;

  @ManyToMany(() => Tag, tag => tag.documents)
  @JoinTable()
  tags: Tag[];
} 