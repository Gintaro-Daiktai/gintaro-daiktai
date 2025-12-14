import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto {
  @IsEnum(['processing', 'delivering', 'delivered', 'cancelled'])
  @IsNotEmpty()
  readonly order_status:
    | 'processing'
    | 'delivering'
    | 'delivered'
    | 'cancelled';
}
