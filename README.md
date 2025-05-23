# Document Management API

A NestJS-based Document Management API that provides functionalities for handling document uploads, organizing documents in folders, tagging documents, and managing access control.

## Features

- **File Upload SDK**: Upload documents with metadata
- **File Type Validation**: Validate supported file types and sizes
- **Folder Management**: Create, edit, and organize documents in folders
- **Document Tagging**: Add, edit, and remove tags for documents
- **Role-Based Access Control**: Assign view, edit, or download permissions to users or groups

## Installation

```bash
# Install dependencies
$ npm install
```

## Running the app

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## API Endpoints

### File Upload

- `POST /api/files/upload` - Upload a new file
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get a specific file
- `DELETE /api/files/:id` - Delete a file

### Folder Management

- `POST /api/folders` - Create a new folder
- `GET /api/folders` - Get all folders
- `GET /api/folders/:id` - Get a specific folder
- `PUT /api/folders/:id` - Update a folder
- `DELETE /api/folders/:id` - Delete a folder
- `PUT /api/folders/:folderId/documents/:documentId` - Add document to folder
- `DELETE /api/folders/documents/:documentId` - Remove document from folder

### Tagging

- `POST /api/tags` - Create a new tag
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get a specific tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag
- `PUT /api/tags/documents/:documentId/tag/:tagId` - Add tag to document
- `DELETE /api/tags/documents/:documentId/tag/:tagId` - Remove tag from document

### Access Control

- `POST /api/permissions` - Grant permission
- `DELETE /api/permissions/:id` - Remove permission
- `GET /api/permissions/document/:documentId` - Get document permissions
- `GET /api/permissions/user/:userId` - Get user permissions
- `GET /api/permissions/group/:groupId` - Get group permissions
- `POST /api/permissions/check` - Check permission

## Technologies Used

- NestJS - Progressive Node.js framework
- TypeORM - ORM for database interactions
- SQLite - Local database
- Multer - File upload middleware

## License

MIT
