import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    newUser.role = createUserDto.role || 'client';
    newUser.balance = 0;
    newUser.confirmed = false;
    newUser.registration_date = new Date();

    const saltRounds = 10;
    newUser.password = await hash(createUserDto.password, saltRounds);

    return await this.userRepository.save(newUser);
  }
  s;
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
