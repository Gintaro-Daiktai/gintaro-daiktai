import {
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1023)
  description: string;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  length: number;

  @IsNumber()
  @IsOptional()
  width: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsEnum(['new', 'used', 'worn', 'broken'])
  @IsOptional()
  condition?: 'new' | 'used' | 'worn' | 'broken';
}
