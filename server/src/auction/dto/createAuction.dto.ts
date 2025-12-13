import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_bid?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_increment?: number;

  @IsNumber()
  @IsNotEmpty()
  item: number;
}
