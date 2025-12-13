import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateLotteryDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;

  @IsEnum(['created', 'started', 'sold out', 'cancelled'])
  @IsNotEmpty()
  lottery_status: 'created' | 'started' | 'sold out' | 'cancelled';

  @IsNumber()
  @IsNotEmpty()
  total_tickets: number;

  @IsNumber()
  @IsNotEmpty()
  ticket_price: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  items: number[];
}
