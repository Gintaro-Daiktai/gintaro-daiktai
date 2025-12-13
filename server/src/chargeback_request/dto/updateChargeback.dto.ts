import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly confirmed: boolean;
}
