import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Use validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  // Set global prefix for APIs
  app.setGlobalPrefix('api');
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Document Management API')
    .setDescription('API for managing documents, folders, tags, and permissions')
    .setVersion('1.0')
    .addTag('files', 'Document file operations')
    .addTag('folders', 'Folder management operations')
    .addTag('tags', 'Document tagging operations')
    .addTag('permissions', 'Access control operations')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(3000);
  console.log(`Document Management API is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
