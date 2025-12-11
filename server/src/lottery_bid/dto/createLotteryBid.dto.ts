import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLotteryBidDto {
  @IsNumber()
  @IsNotEmpty()
  ticket_count: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  lottery_id: number;
}
