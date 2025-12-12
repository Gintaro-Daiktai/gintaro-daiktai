import { IsNumber, Min, Max } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  @Min(100)
  @Max(1000000)
  amount: number;
}
