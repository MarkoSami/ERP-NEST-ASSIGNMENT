import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Use validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Serve static files from the uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  // Set global prefix for APIs
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log(`Document Management API is running on: ${await app.getUrl()}`);
}
bootstrap();
