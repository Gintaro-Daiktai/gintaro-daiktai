import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemTagDto {
  @IsNumber()
  @IsNotEmpty()
  item: number;

  @IsNumber()
  @IsNotEmpty()
  tag: number;
}
