import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  @IsNotEmpty()
  readonly deliveryId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly receiverId: number;

  @IsNumber()
  @IsOptional()
  readonly parentMessageId?: number;
}
