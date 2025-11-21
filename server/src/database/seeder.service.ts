import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async seedAdminUser(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD not set in .env file. Skipping admin user creation.',
      );
      return;
    }

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      this.logger.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await hash(adminPassword, saltRounds);

    const admin = this.userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin',
      last_name: 'User',
      phone_number: '0000000000',
      balance: 0,
      confirmed: true,
      registration_date: new Date(),
      birth_date: new Date('1990-01-01'),
    });

    await this.userRepository.save(admin);

    this.logger.log(`Admin user created successfully: ${adminEmail}`);
    this.logger.warn(
      'IMPORTANT: Make sure to use a strong password and keep your .env file secure!',
    );
  }
}
