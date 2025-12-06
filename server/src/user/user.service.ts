import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
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
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

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

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const user = await this.findUserById(id);

    if (!user) {
      return null;
    }

    // Update only provided fields
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.last_name !== undefined) {
      user.last_name = updateUserDto.last_name;
    }
    if (updateUserDto.phone_number !== undefined) {
      user.phone_number = updateUserDto.phone_number;
    }
    if (updateUserDto.avatar !== undefined) {
      if (updateUserDto.avatar) {
        user.avatar = Buffer.from(updateUserDto.avatar, 'base64');
      }
    }

    return await this.userRepository.save(user);
  }
}
