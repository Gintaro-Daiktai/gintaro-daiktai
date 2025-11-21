import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private emailEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.emailEnabled =
      this.configService.get<string>('EMAIL_VERIFICATION_ENABLED') === 'true';

    if (this.emailEnabled) {
      const smtpHost = this.configService.get<string>('SMTP_HOST');
      const smtpPort = this.configService.get<number>('SMTP_PORT');
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');

      if (smtpHost && smtpPort && smtpUser && smtpPass) {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        this.logger.log('Email service initialized with SMTP');
      } else {
        this.logger.warn(
          'SMTP credentials not configured. Email will be logged to console only.',
        );
      }
    } else {
      this.logger.log('Email verification disabled. Using console mode.');
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const from =
      this.configService.get<string>('SMTP_FROM') || 'noreply@app.com';
    const subject = 'Verify Your Email Address';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `;

    const text = `
      Email Verification
      
      Thank you for registering! Please use the following code to verify your email address:
      
      ${code}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
    `;

    if (this.transporter && this.emailEnabled) {
      try {
        await this.transporter.sendMail({
          from,
          to: email,
          subject,
          text,
          html,
        });
        this.logger.log(`Verification email sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${email}:`, error);
        this.logToConsole(email, code);
      }
    } else {
      this.logToConsole(email, code);
    }
  }

  private logToConsole(email: string, code: string): void {
    this.logger.log('========================================');
    this.logger.log('📧 VERIFICATION EMAIL (Console Mode)');
    this.logger.log('========================================');
    this.logger.log(`To: ${email}`);
    this.logger.log(`Verification Code: ${code}`);
    this.logger.log('Expires in: 10 minutes');
    this.logger.log('========================================');
  }
}
