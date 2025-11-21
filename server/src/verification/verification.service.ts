import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { VerificationCodeEntity } from './verification.entity';
import { UserEntity } from '../user/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly CODE_EXPIRY_MINUTES = 10;
  private readonly MAX_VERIFICATION_ATTEMPTS = 5;
  private readonly MAX_RESEND_PER_HOUR = 3;

  constructor(
    @InjectRepository(VerificationCodeEntity)
    private readonly verificationCodeRepository: Repository<VerificationCodeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createVerificationCode(userId: number, email: string): Promise<void> {
    // Check rate limit for resending
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCodes = await this.verificationCodeRepository.count({
      where: {
        userId,
        createdAt: LessThan(oneHourAgo),
      },
    });

    if (recentCodes >= this.MAX_RESEND_PER_HOUR) {
      throw new BadRequestException(
        'Too many verification attempts. Please try again later.',
      );
    }

    // Invalidate any existing unused codes for this user
    await this.verificationCodeRepository.update(
      { userId, used: false },
      { used: true },
    );

    // Generate new code
    const code = this.generateCode();
    const expiresAt = new Date(
      Date.now() + this.CODE_EXPIRY_MINUTES * 60 * 1000,
    );

    const verificationCode = this.verificationCodeRepository.create({
      userId,
      code,
      expiresAt,
      attempts: 0,
      used: false,
    });

    await this.verificationCodeRepository.save(verificationCode);
    await this.emailService.sendVerificationCode(email, code);

    this.logger.log(`Verification code created for user ${userId}`);
  }

  async verifyCode(userId: number, code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        userId,
        used: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!verificationCode) {
      throw new BadRequestException('No verification code found');
    }

    // Check if code has expired
    if (new Date() > verificationCode.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    // Check max attempts
    if (verificationCode.attempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      throw new BadRequestException(
        'Too many failed attempts. Please request a new code.',
      );
    }

    // Increment attempts
    verificationCode.attempts += 1;
    await this.verificationCodeRepository.save(verificationCode);

    // Verify code
    if (verificationCode.code !== code) {
      const remainingAttempts =
        this.MAX_VERIFICATION_ATTEMPTS - verificationCode.attempts;
      throw new UnauthorizedException(
        `Invalid verification code. ${remainingAttempts} attempts remaining.`,
      );
    }

    // Mark code as used
    verificationCode.used = true;
    await this.verificationCodeRepository.save(verificationCode);

    // Mark user as confirmed
    await this.userRepository.update({ id: userId }, { confirmed: true });

    this.logger.log(`User ${userId} successfully verified`);
    return true;
  }

  async resendCode(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.confirmed) {
      throw new BadRequestException('User is already verified');
    }

    await this.createVerificationCode(userId, user.email);
  }

  async resendCodeByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.confirmed) {
      throw new BadRequestException('User is already verified');
    }

    await this.createVerificationCode(user.id, user.email);
  }

  async cleanupExpiredCodes(): Promise<void> {
    const now = new Date();
    await this.verificationCodeRepository.delete({
      expiresAt: LessThan(now),
    });
    this.logger.log('Expired verification codes cleaned up');
  }
}
