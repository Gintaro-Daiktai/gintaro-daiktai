import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsArray,
  ArrayNotEmpty,
  MaxLength,
  IsString,
} from 'class-validator';

export class CreateLotteryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;

  @IsNumber()
  @IsNotEmpty()
  total_tickets: number;

  @IsNumber()
  @IsNotEmpty()
  ticket_price: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  itemIds: number[];
}
