import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createCheckoutSession(
    userId: number,
    amountInCents: number,
  ): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Account Balance Deposit',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        userId: userId.toString(),
        type: 'deposit',
      },
      custom_text: {
        submit: {
          message: 'Your balance will be updated immediately after payment.',
        },
      },
    });

    return session.client_secret!;
  }

  async handleWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret!,
      );
    } catch {
      throw new BadRequestException(`Webhook signature verification failed`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        // Additional handling if needed
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payments
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const userId = parseInt(session.metadata!.userId);
    const amountInCents = session.amount_total;
    const amountInDollars = amountInCents! / 100;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    // Check if payment was already processed
    const processedPayments = user.processedPaymentIds || [];
    if (processedPayments.includes(session.id)) {
      console.log(`Payment ${session.id} already processed`);
      return;
    }

    user.balance += amountInDollars;
    user.processedPaymentIds = [...processedPayments, session.id];
    await this.userRepository.save(user);

    console.log(
      `Balance updated for user ${userId}: +$${amountInDollars} (session: ${session.id})`,
    );
  }

  async processWithdrawal(userId: number, amountInCents: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const amountInDollars = amountInCents / 100;

    if (user.balance < amountInDollars) {
      throw new BadRequestException('Insufficient balance');
    }

    //THIS IS JUST A SIMULATION BECAUSE IM NOT ABOUT TO GO THROUGH STRIPE CONNECT VERIFICATION JUST FOR THIS
    user.balance -= amountInDollars;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Withdrawal processed successfully',
      newBalance: user.balance,
    };
  }

  async getCheckoutSessionStatus(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.status,
      payment_status: session.payment_status,
    };
  }
}
