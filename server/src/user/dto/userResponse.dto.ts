import { Exclude, Transform } from 'class-transformer';

export class UserResponseDto {
  @Exclude()
  password: string;

  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Buffer.isBuffer(value)) {
      return value.toString('base64');
    }
    return value as string;
  })
  avatar?: string;
}
