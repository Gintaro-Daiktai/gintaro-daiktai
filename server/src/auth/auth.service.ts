import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthPayloadDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authPayloadDto: AuthPayloadDto): Promise<string | null> {
    const user = await this.usersService.findUserByEmail(authPayloadDto.email);
    if (user && (await compare(authPayloadDto.password, user.password))) {
      return this.jwtService.sign({ email: user.email, sub: user.id });
    }
    return null;
  }
}
