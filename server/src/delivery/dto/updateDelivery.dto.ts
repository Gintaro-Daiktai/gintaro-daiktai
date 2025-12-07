import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto {
  @IsEnum(['processing', 'delivering', 'delivered', 'canceled'])
  @IsNotEmpty()
  readonly order_status: 'processing' | 'delivering' | 'delivered' | 'canceled';
}
