import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateChargeBackDto {
  /**
   * The reason for the chargeback request
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  readonly reason: string;

  /**
   * Foreign Key for the Delivery
   */
  @IsNumber()
  @IsNotEmpty()
  readonly delivery: number;
}
