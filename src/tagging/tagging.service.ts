import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../models/tag.entity';
import { Document } from '../models/document.entity';

@Injectable()
export class TaggingService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async createTag(name: string): Promise<Tag> {
    const tag = new Tag();
    tag.name = name;
    return this.tagRepository.save(tag);
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async getTag(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['documents'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async updateTag(id: string, name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    tag.name = name;
    return this.tagRepository.save(tag);
  }

  async deleteTag(id: string): Promise<boolean> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['documents'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Remove the tag from all documents
    if (tag.documents && tag.documents.length > 0) {
      for (const doc of tag.documents) {
        doc.tags = doc.tags.filter(t => t.id !== tag.id);
        await this.documentRepository.save(doc);
      }
    }

    await this.tagRepository.remove(tag);
    return true;
  }

  async addTagToDocument(documentId: string, tagId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['tags'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    // Check if the document already has this tag
    if (!document.tags) {
      document.tags = [];
    }
    
    if (!document.tags.some(t => t.id === tag.id)) {
      document.tags.push(tag);
      return this.documentRepository.save(document);
    }
    
    return document;
  }

  async removeTagFromDocument(documentId: string, tagId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['tags'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    if (document.tags) {
      document.tags = document.tags.filter(tag => tag.id !== tagId);
      return this.documentRepository.save(document);
    }

    return document;
  }
} 