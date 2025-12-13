import { Type } from 'class-transformer';
import { DeliveryResponseDto } from '../../delivery/dto/DeliveryResponseDto';

export class ChargebackRequestResponseDto {
  id: number;
  reason: string;
  confirmed: boolean;

  @Type(() => DeliveryResponseDto)
  delivery: DeliveryResponseDto;
}
