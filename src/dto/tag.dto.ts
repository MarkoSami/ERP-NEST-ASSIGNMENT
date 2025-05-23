import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Name of the tag' })
  @IsString()
  name: string;
}

export class UpdateTagDto {
  @ApiProperty({ description: 'Updated name of the tag' })
  @IsString()
  name: string;
}

export class TagResponseDto {
  @ApiProperty({ description: 'Unique identifier of the tag' })
  id: string;

  @ApiProperty({ description: 'Name of the tag' })
  name: string;

  @ApiProperty({
    description: 'Documents associated with this tag',
    type: 'array',
  })
  documents: any[];
}

export class TagSuccessResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean;
} 