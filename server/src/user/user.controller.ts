import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Param,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { VerificationService } from '../verification/verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ConfirmedGuard } from '../auth/guards/confirmed.guard';
import { UserResponseDto } from './dto/userResponse.dto';
import { plainToInstance } from 'class-transformer';

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

  @Get(':id')
  async getUserById(
    @User() user: UserPayload,
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    const userData = await this.userService.findUserById(parseInt(id, 10));
    if (!userData) {
      throw new NotFoundException('User not found.');
    }
    return plainToInstance(UserResponseDto, userData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async updateUser(
    @User() user: UserPayload,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userId = parseInt(id, 10);

    // Only allow users to update their own profile
    if (user.userId !== userId) {
      throw new UnauthorizedException('You can only update your own profile.');
    }

    const updatedUser = await this.userService.updateUser(
      userId,
      updateUserDto,
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    return plainToInstance(UserResponseDto, updatedUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ConfirmedGuard)
  async deleteUser(
    @User() user: UserPayload,
    @Param('id') id: string,
  ): Promise<any> {
    const userId = parseInt(id, 10);

    if (user.userId !== userId && user.role !== 'admin') {
      throw new UnauthorizedException('You can only delete your own account.');
    }

    await this.userService.deleteUser(userId);
    return {
      message: 'User deleted successfully',
    };
  }
}
