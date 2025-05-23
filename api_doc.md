# Document Management API Documentation

This document provides detailed information about all endpoints available in the Document Management API.

## Table of Contents
- [File Management](#file-management)
- [Folder Management](#folder-management)
- [Tagging](#tagging)
- [Access Control](#access-control)

## Base URL

All endpoints are prefixed with `/api`

## File Management

### Upload a File

Upload a document file with metadata.

- **URL**: `/files/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

**Request Body**:
| Field | Type | Description |
|-------|------|-------------|
| file | File | The document file to upload |
| title | String | Title of the document |
| description | String | (Optional) Description of the document |
| folderId | UUID | (Optional) ID of the folder to place the document in |

**Response**:
```json
{
  "id": "uuid",
  "title": "My Document",
  "description": "Description of my document",
  "fileName": "original-file-name.pdf",
  "filePath": "uploads/file-1234567890.pdf",
  "fileSize": 1024,
  "fileType": "application/pdf",
  "uploadedAt": "2023-06-15T12:34:56.789Z",
  "folder": {
    "id": "folder-uuid",
    "name": "My Folder"
  },
  "tags": []
}
```

**Status Codes**:
- 201 Created: Successfully uploaded
- 400 Bad Request: Invalid file or metadata
- 415 Unsupported Media Type: File type not supported

### Download a File

Download a document file by its ID.

- **URL**: `/files/:id/download`
- **Method**: `GET`
- **URL Parameters**: `id=[uuid]` - ID of the document to download

**Response**:
The file will be downloaded with appropriate headers:
- `Content-Type`: The original MIME type of the file
- `Content-Disposition`: attachment; filename="original-filename.ext"

**Status Codes**:
- 200 OK: File downloaded successfully
- 404 Not Found: Document not found

### Get All Documents

Retrieve a list of all documents.

- **URL**: `/files`
- **Method**: `GET`

**Response**:
```json
[
  {
    "id": "uuid-1",
    "title": "Document 1",
    "description": "Description 1",
    "fileName": "file1.pdf",
    "filePath": "uploads/file-1.pdf",
    "fileSize": 1024,
    "fileType": "application/pdf",
    "uploadedAt": "2023-06-15T12:34:56.789Z",
    "folder": { "id": "folder-id", "name": "Folder 1" },
    "tags": [
      { "id": "tag-id-1", "name": "Important" },
      { "id": "tag-id-2", "name": "Finance" }
    ]
  },
  // More documents...
]
```

### Get Document by ID

Retrieve a specific document by its ID.

- **URL**: `/files/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[uuid]` - ID of the document

**Response**:
```json
{
  "id": "uuid",
  "title": "My Document",
  "description": "Description of my document",
  "fileName": "original-file-name.pdf",
  "filePath": "uploads/file-1234567890.pdf",
  "fileSize": 1024,
  "fileType": "application/pdf",
  "uploadedAt": "2023-06-15T12:34:56.789Z",
  "folder": {
    "id": "folder-uuid",
    "name": "My Folder"
  },
  "tags": [
    { "id": "tag-id-1", "name": "Important" }
  ]
}
```

**Status Codes**:
- 200 OK: Document found
- 404 Not Found: Document not found

### Delete Document

Delete a document by its ID.

- **URL**: `/files/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[uuid]` - ID of the document to delete

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- 200 OK: Document deleted
- 404 Not Found: Document not found

## Folder Management

### Create Folder

Create a new folder for organizing documents.

- **URL**: `/folders`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "My Folder",
  "parentFolderId": "uuid" // Optional
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "My Folder",
  "parentFolder": {
    "id": "parent-uuid",
    "name": "Parent Folder"
  },
  "subFolders": [],
  "documents": []
}
```

**Status Codes**:
- 201 Created: Folder created successfully
- 400 Bad Request: Invalid folder data

### Get All Folders

Retrieve a list of all folders.

- **URL**: `/folders`
- **Method**: `GET`

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Folder 1",
    "parentFolder": null,
    "subFolders": [
      {
        "id": "sub-folder-uuid",
        "name": "Sub Folder 1"
      }
    ],
    "documents": [
      {
        "id": "doc-uuid",
        "title": "Document 1"
      }
    ]
  },
  // More folders...
]
```

### Get Folder by ID

Retrieve a specific folder by its ID.

- **URL**: `/folders/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[uuid]` - ID of the folder

**Response**:
```json
{
  "id": "uuid",
  "name": "My Folder",
  "parentFolder": {
    "id": "parent-uuid",
    "name": "Parent Folder"
  },
  "subFolders": [
    {
      "id": "sub-folder-uuid",
      "name": "Sub Folder"
    }
  ],
  "documents": [
    {
      "id": "doc-uuid-1",
      "title": "Document 1"
    }
  ]
}
```

**Status Codes**:
- 200 OK: Folder found
- 404 Not Found: Folder not found

### Update Folder

Update a folder's properties.

- **URL**: `/folders/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[uuid]` - ID of the folder to update
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Updated Folder Name",
  "parentFolderId": "new-parent-uuid" // Optional
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Updated Folder Name",
  "parentFolder": {
    "id": "new-parent-uuid",
    "name": "New Parent Folder"
  },
  "subFolders": [],
  "documents": []
}
```

**Status Codes**:
- 200 OK: Folder updated
- 400 Bad Request: Invalid update data
- 404 Not Found: Folder not found

### Delete Folder

Delete a folder by its ID.

- **URL**: `/folders/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[uuid]` - ID of the folder to delete

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- 200 OK: Folder deleted
- 400 Bad Request: Cannot delete folder with contents
- 404 Not Found: Folder not found

### Add Document to Folder

Move a document into a specific folder.

- **URL**: `/folders/:folderId/documents/:documentId`
- **Method**: `PUT`
- **URL Parameters**:
  - `folderId=[uuid]` - ID of the target folder
  - `documentId=[uuid]` - ID of the document to move

**Response**:
```json
{
  "id": "doc-uuid",
  "title": "Document Title",
  "folder": {
    "id": "folder-uuid",
    "name": "Folder Name"
  }
  // Other document properties...
}
```

**Status Codes**:
- 200 OK: Document moved to folder
- 404 Not Found: Document or folder not found

### Remove Document from Folder

Remove a document from its current folder.

- **URL**: `/folders/documents/:documentId`
- **Method**: `DELETE`
- **URL Parameters**: `documentId=[uuid]` - ID of the document to remove from its folder

**Response**:
```json
{
  "id": "doc-uuid",
  "title": "Document Title",
  "folder": null
  // Other document properties...
}
```

**Status Codes**:
- 200 OK: Document removed from folder
- 404 Not Found: Document not found

## Tagging

### Create Tag

Create a new tag for documents.

- **URL**: `/tags`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Important"
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Important",
  "documents": []
}
```

**Status Codes**:
- 201 Created: Tag created successfully
- 400 Bad Request: Invalid tag data

### Get All Tags

Retrieve a list of all tags.

- **URL**: `/tags`
- **Method**: `GET`

**Response**:
```json
[
  {
    "id": "tag-uuid-1",
    "name": "Important"
  },
  {
    "id": "tag-uuid-2",
    "name": "Finance"
  },
  // More tags...
]
```

### Get Tag by ID

Retrieve a specific tag by its ID.

- **URL**: `/tags/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[uuid]` - ID of the tag

**Response**:
```json
{
  "id": "uuid",
  "name": "Important",
  "documents": [
    {
      "id": "doc-uuid-1",
      "title": "Document 1"
    },
    {
      "id": "doc-uuid-2",
      "title": "Document 2"
    }
  ]
}
```

**Status Codes**:
- 200 OK: Tag found
- 404 Not Found: Tag not found

### Update Tag

Update a tag's properties.

- **URL**: `/tags/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[uuid]` - ID of the tag to update
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "Very Important"
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Very Important"
}
```

**Status Codes**:
- 200 OK: Tag updated
- 400 Bad Request: Invalid update data
- 404 Not Found: Tag not found

### Delete Tag

Delete a tag by its ID.

- **URL**: `/tags/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[uuid]` - ID of the tag to delete

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- 200 OK: Tag deleted
- 404 Not Found: Tag not found

### Add Tag to Document

Add a tag to a document.

- **URL**: `/tags/documents/:documentId/tag/:tagId`
- **Method**: `PUT`
- **URL Parameters**:
  - `documentId=[uuid]` - ID of the document
  - `tagId=[uuid]` - ID of the tag to add

**Response**:
```json
{
  "id": "doc-uuid",
  "title": "Document Title",
  "tags": [
    {
      "id": "tag-uuid-1",
      "name": "Important"
    },
    {
      "id": "tag-uuid-2",
      "name": "Finance"
    }
  ]
  // Other document properties...
}
```

**Status Codes**:
- 200 OK: Tag added to document
- 404 Not Found: Document or tag not found

### Remove Tag from Document

Remove a tag from a document.

- **URL**: `/tags/documents/:documentId/tag/:tagId`
- **Method**: `DELETE`
- **URL Parameters**:
  - `documentId=[uuid]` - ID of the document
  - `tagId=[uuid]` - ID of the tag to remove

**Response**:
```json
{
  "id": "doc-uuid",
  "title": "Document Title",
  "tags": [
    // The removed tag will not be in this array
  ]
  // Other document properties...
}
```

**Status Codes**:
- 200 OK: Tag removed from document
- 404 Not Found: Document or tag not found

## Access Control

### Grant Permission

Grant permission to a user or group for a document.

- **URL**: `/permissions`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "documentId": "doc-uuid",
  "userId": "user-uuid",
  "permissionLevel": "view", // "view", "edit", or "download"
  "groupId": "group-uuid" // Optional
}
```

**Response**:
```json
{
  "id": "permission-uuid",
  "userId": "user-uuid",
  "groupId": "group-uuid",
  "level": "view",
  "document": {
    "id": "doc-uuid",
    "title": "Document Title"
  }
}
```

**Status Codes**:
- 201 Created: Permission granted successfully
- 400 Bad Request: Invalid permission data
- 404 Not Found: Document, user, or group not found

### Remove Permission

Remove a permission by its ID.

- **URL**: `/permissions/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[uuid]` - ID of the permission to remove

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- 200 OK: Permission removed
- 404 Not Found: Permission not found

### Get Document Permissions

Get all permissions for a specific document.

- **URL**: `/permissions/document/:documentId`
- **Method**: `GET`
- **URL Parameters**: `documentId=[uuid]` - ID of the document

**Response**:
```json
[
  {
    "id": "permission-uuid-1",
    "userId": "user-uuid-1",
    "level": "edit",
    "groupId": null
  },
  {
    "id": "permission-uuid-2",
    "userId": "user-uuid-2",
    "level": "view",
    "groupId": "group-uuid-1"
  }
  // More permissions...
]
```

**Status Codes**:
- 200 OK: Permissions retrieved
- 404 Not Found: Document not found

### Get User Permissions

Get all permissions assigned to a specific user.

- **URL**: `/permissions/user/:userId`
- **Method**: `GET`
- **URL Parameters**: `userId=[string]` - ID of the user

**Response**:
```json
[
  {
    "id": "permission-uuid-1",
    "level": "edit",
    "document": {
      "id": "doc-uuid-1",
      "title": "Document 1"
    }
  },
  {
    "id": "permission-uuid-2",
    "level": "view",
    "document": {
      "id": "doc-uuid-2",
      "title": "Document 2"
    }
  }
  // More permissions...
]
```

**Status Codes**:
- 200 OK: Permissions retrieved

### Get Group Permissions

Get all permissions assigned to a specific group.

- **URL**: `/permissions/group/:groupId`
- **Method**: `GET`
- **URL Parameters**: `groupId=[string]` - ID of the group

**Response**:
```json
[
  {
    "id": "permission-uuid-1",
    "level": "view",
    "document": {
      "id": "doc-uuid-1",
      "title": "Document 1"
    }
  },
  // More permissions...
]
```

**Status Codes**:
- 200 OK: Permissions retrieved

### Check Permission

Check if a user has a specific permission level for a document.

- **URL**: `/permissions/check`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "documentId": "doc-uuid",
  "userId": "user-uuid",
  "requiredLevel": "edit" // "view", "edit", or "download"
}
```

**Response**:
```json
{
  "hasPermission": true
}
```

**Status Codes**:
- 200 OK: Permission check completed

## File Access Methods

### Method 1: Download Endpoint (Recommended)
Use the download endpoint for secure, tracked downloads:
```
GET /api/files/{document-id}/download
```

### Method 2: Direct File Access
Files can also be accessed directly via static serving:
```
GET /uploads/{filename}
```

## Status Codes

- 200 OK: The request has succeeded
- 201 Created: The request has been fulfilled and a new resource has been created
- 400 Bad Request: The request was invalid or cannot be otherwise served
- 401 Unauthorized: Authentication failed or user does not have permissions
- 404 Not Found: The requested resource could not be found
- 415 Unsupported Media Type: The requested content type or version is invalid 