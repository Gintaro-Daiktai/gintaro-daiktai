import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { VerificationService } from '../verification/verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    const newUser = await this.userService.createUser(createUserDto);

    await this.verificationService.createVerificationCode(
      newUser.id,
      newUser.email,
    );

    return {
      userId: newUser.id,
      email: newUser.email,
      message:
        'User created successfully. Please check your email for the verification code.',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllUsers(): Promise<any> {
    const users = await this.userService.findAllUsers();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      balance: user.balance,
      confirmed: user.confirmed,
      registration_date: user.registration_date,
      birth_date: user.birth_date,
      role: user.role,
    }));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteUser(@Param('id') id: string): Promise<any> {
    await this.userService.deleteUser(parseInt(id, 10));
    return {
      message: 'User deleted successfully',
    };
  }
}
