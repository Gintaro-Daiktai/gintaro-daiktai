import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDeliveryDto {
  @IsNumber()
  @IsNotEmpty()
  readonly item: number;

  /**
   * Foreign Key for the Sender (User)
   */
  @IsNumber()
  @IsNotEmpty()
  readonly sender: number;

  /**
   * Foreign Key for the Receiver (User)
   */
  @IsNumber()
  @IsNotEmpty()
  readonly receiver: number;

  @IsEnum(['processing', 'delivering', 'delivered', 'canceled'])
  @IsNotEmpty()
  readonly order_status: 'processing';
}
