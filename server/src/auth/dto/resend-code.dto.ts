import { IsNumber, IsOptional, IsEmail } from 'class-validator';

export class ResendCodeDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
