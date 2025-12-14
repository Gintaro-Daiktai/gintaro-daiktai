import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateAuctionBidDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sum: number;

  @IsNumber()
  @IsNotEmpty()
  auction: number;
}
