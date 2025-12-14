import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateChargebackDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly confirmed: boolean;
}
