import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsInt,
  ArrayUnique,
} from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1023)
  description?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsEnum(['new', 'used', 'worn', 'broken'])
  @IsOptional()
  condition?: 'new' | 'used' | 'worn' | 'broken';

  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  tagIds?: number[];
}
