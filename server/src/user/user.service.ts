import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    newUser.role = createUserDto.role || 'client';
    newUser.balance = 0;
    newUser.confirmed = false;
    newUser.registration_date = new Date();

    return await this.userRepository.save(newUser);
  }
}
