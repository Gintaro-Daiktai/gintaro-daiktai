import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { VerificationService } from '../verification/verification.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request): Express.User | undefined {
    const user = req.user;
    return user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminOnly(@Req() req: Request) {
    return { message: 'Admin access granted', user: req.user };
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.verificationService.verifyCode(
      verifyEmailDto.userId,
      verifyEmailDto.code,
    );

    const user = await this.userService.findUserById(verifyEmailDto.userId);

    if (!user) {
      throw new Error('User not found');
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id,
      role: user.role,
      confirmed: true,
    });

    return {
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        confirmed: true,
      },
    };
  }

  @Post('resend-code')
  async resendCode(@Body() resendCodeDto: ResendCodeDto) {
    if (resendCodeDto.userId) {
      await this.verificationService.resendCode(resendCodeDto.userId);
    } else if (resendCodeDto.email) {
      await this.verificationService.resendCodeByEmail(resendCodeDto.email);
    } else {
      throw new Error('Either userId or email must be provided');
    }

    return {
      message: 'Verification code sent successfully',
    };
  }
}
