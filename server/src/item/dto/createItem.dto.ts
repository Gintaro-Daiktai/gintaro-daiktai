import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
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
  condition?: 'new' | 'used' | 'worn' | 'broken';
}
