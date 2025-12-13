import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLotteryBidDto {
  @IsNumber()
  @IsNotEmpty()
  ticket_count: number;

  @IsNumber()
  @IsNotEmpty()
  lottery: number;
}
