import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { AuctionEntity } from 'src/auction/auction.entity';

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

  async sendAuctionReminder(
    email: string,
    auction: AuctionEntity,
    timeRemaining: string,
  ): Promise<void> {
    const subject = `Auction Ending Soon - ${timeRemaining} left!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>⏰ Auction Ending Soon!</h2>
        <p>The auction you're bidding on is ending in <strong>${timeRemaining}</strong>.</p>
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Auction Details</h3>
          <p><strong>Item:</strong> ${auction.item?.name || 'N/A'}</p>
          <p><strong>Ends at:</strong> ${new Date(auction.end_date).toLocaleString()}</p>
        </div>
        <p>Don't miss your chance to win!</p>
      </div>
    `;

    const text = `
      Auction Ending Soon!
      
      The auction you're bidding on is ending in ${timeRemaining}.
      
      Item: ${auction.item?.name || 'N/A'}
      Ends at: ${new Date(auction.end_date).toLocaleString()}
      
      Don't miss your chance to win!
    `;

    await this.sendEmail(email, subject, text, html, 'AUCTION REMINDER');
  }

  async sendAuctionWonNotification(
    email: string,
    auction: AuctionEntity,
    winningBid: number,
  ): Promise<void> {
    const subject = '🎉 Congratulations! You won the auction!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎉 Congratulations!</h2>
        <p>You have won the auction!</p>
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <h3 style="margin-top: 0; color: #2e7d32;">Winning Bid Details</h3>
          <p><strong>Item:</strong> ${auction.item?.name || 'N/A'}</p>
          <p><strong>Your Winning Bid:</strong> $${winningBid.toFixed(2)}</p>
          <p><strong>Ended at:</strong> ${new Date(auction.end_date).toLocaleString()}</p>
        </div>
        <p>A delivery has been created and is now being processed. You'll receive updates on the delivery status.</p>
      </div>
    `;

    const text = `
      Congratulations!
      
      You have won the auction!
      
      Item: ${auction.item?.name || 'N/A'}
      Your Winning Bid: $${winningBid.toFixed(2)}
      Ended at: ${new Date(auction.end_date).toLocaleString()}
      
      A delivery has been created and is now being processed.
    `;

    await this.sendEmail(email, subject, text, html, 'AUCTION WON');
  }

  async sendAuctionLostNotification(
    email: string,
    auction: AuctionEntity,
    yourBid: number,
  ): Promise<void> {
    const subject = 'Auction Ended - Bid Refunded';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Auction Ended</h2>
        <p>Unfortunately, you did not win this auction.</p>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <h3 style="margin-top: 0; color: #e65100;">Auction Details</h3>
          <p><strong>Item:</strong> ${auction.item?.name || 'N/A'}</p>
          <p><strong>Your Bid:</strong> $${yourBid.toFixed(2)}</p>
          <p><strong>Ended at:</strong> ${new Date(auction.end_date).toLocaleString()}</p>
        </div>
        <p>Your bid of <strong>$${yourBid.toFixed(2)}</strong> has been refunded to your account balance.</p>
        <p>Better luck next time!</p>
      </div>
    `;

    const text = `
      Auction Ended
      
      Unfortunately, you did not win this auction.
      
      Item: ${auction.item?.name || 'N/A'}
      Your Bid: $${yourBid.toFixed(2)}
      Ended at: ${new Date(auction.end_date).toLocaleString()}
      
      Your bid of $${yourBid.toFixed(2)} has been refunded to your account balance.
      
      Better luck next time!
    `;

    await this.sendEmail(email, subject, text, html, 'AUCTION LOST');
  }

  async sendAuctionSoldNotification(
    email: string,
    auction: AuctionEntity,
    soldPrice: number,
  ): Promise<void> {
    const subject = '✅ Your auction sold successfully!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>✅ Auction Sold!</h2>
        <p>Your auction has ended successfully!</p>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <h3 style="margin-top: 0; color: #1565c0;">Sale Details</h3>
          <p><strong>Item:</strong> ${auction.item?.name || 'N/A'}</p>
          <p><strong>Final Price:</strong> $${soldPrice.toFixed(2)}</p>
          <p><strong>Ended at:</strong> ${new Date(auction.end_date).toLocaleString()}</p>
        </div>
        <p>A delivery has been created. Please prepare the item for shipping.</p>
      </div>
    `;

    const text = `
      Auction Sold!
      
      Your auction has ended successfully!
      
      Item: ${auction.item?.name || 'N/A'}
      Final Price: $${soldPrice.toFixed(2)}
      Ended at: ${new Date(auction.end_date).toLocaleString()}
      
      A delivery has been created. Please prepare the item for shipping.
    `;

    await this.sendEmail(email, subject, text, html, 'AUCTION SOLD');
  }

  async sendAuctionNoBidsNotification(
    email: string,
    auction: AuctionEntity,
  ): Promise<void> {
    const subject = 'Auction Ended - No Bids Received';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Auction Ended</h2>
        <p>Your auction has ended without receiving any bids.</p>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <h3 style="margin-top: 0; color: #e65100;">Auction Details</h3>
          <p><strong>Item:</strong> ${auction.item?.name || 'N/A'}</p>
          <p><strong>Ended at:</strong> ${new Date(auction.end_date).toLocaleString()}</p>
        </div>
        <p>You can create a new auction for this item if you wish.</p>
      </div>
    `;

    const text = `
      Auction Ended
      
      Your auction has ended without receiving any bids.
      
      Item: ${auction.item?.name || 'N/A'}
      Ended at: ${new Date(auction.end_date).toLocaleString()}
      
      You can create a new auction for this item if you wish.
    `;

    await this.sendEmail(email, subject, text, html, 'AUCTION NO BIDS');
  }

  private async sendEmail(
    email: string,
    subject: string,
    text: string,
    html: string,
    consoleLabel: string,
  ): Promise<void> {
    const from =
      this.configService.get<string>('SMTP_FROM') || 'noreply@app.com';

    if (this.transporter && this.emailEnabled) {
      try {
        await this.transporter.sendMail({
          from,
          to: email,
          subject,
          text,
          html,
        });
        this.logger.log(`${consoleLabel} email sent to ${email}`);
      } catch (error) {
        this.logger.error(
          `Failed to send ${consoleLabel} email to ${email}:`,
          error,
        );
        this.logAuctionEmailToConsole(email, subject, text, consoleLabel);
      }
    } else {
      this.logAuctionEmailToConsole(email, subject, text, consoleLabel);
    }
  }

  private logAuctionEmailToConsole(
    email: string,
    subject: string,
    text: string,
    label: string,
  ): void {
    this.logger.log('========================================');
    this.logger.log(`📧 ${label} (Console Mode)`);
    this.logger.log('========================================');
    this.logger.log(`To: ${email}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Message:\n${text}`);
    this.logger.log('========================================');
  }
}
