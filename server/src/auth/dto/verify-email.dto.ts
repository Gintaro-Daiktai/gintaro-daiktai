import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
