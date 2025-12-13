import { Exclude, Transform, Type } from 'class-transformer';

export class DeliveryUserDto {
  id: number;
  name: string;
  last_name: string;

  @Exclude()
  password: string;

  @Exclude()
  email: string;

  @Exclude()
  phone_number: string;

  @Exclude()
  balance: number;

  @Exclude()
  processedPaymentIds: string[];

  @Exclude()
  confirmed: boolean;

  @Exclude()
  registration_date: Date;

  @Exclude()
  birth_date: Date;

  @Exclude()
  role: string;

  @Exclude()
  addresses: any;

  @Exclude()
  items: any;

  @Exclude()
  lotteryBids: any;

  @Exclude()
  lotteries: any;

  @Exclude()
  auctions: any;

  @Exclude()
  auctionBids: any;

  @Exclude()
  reviewsWritten: any;

  @Exclude()
  reviewsReceived: any;

  @Exclude()
  reviewEmotes: any;

  @Exclude()
  deliveriesSent: any;

  @Exclude()
  deliveriesReceived: any;

  @Exclude()
  messagesSent: any;

  @Exclude()
  messagesReceived: any;

  @Exclude()
  avatar?: any;
}

export class DeliveryItemDto {
  id: number;
  name: string;
  description: string;

  @Exclude()
  creation_date: Date;

  @Exclude()
  view_count: number;

  @Exclude()
  weight: number;

  @Exclude()
  length: number;

  @Exclude()
  width: number;

  @Exclude()
  height: number;

  @Exclude()
  condition: string;

  @Exclude()
  seller: any;

  @Exclude()
  images: any;

  @Exclude()
  tags: any;

  @Exclude()
  auction: any;

  @Exclude()
  lottery: any;

  @Exclude()
  deliveries: any;

  @Exclude()
  reviews: any;
}

export class DeliveryResponseDto {
  id: number;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  })
  order_date: Date;

  order_status: 'processing' | 'delivering' | 'delivered' | 'cancelled';

  @Type(() => DeliveryItemDto)
  item: DeliveryItemDto;

  @Type(() => DeliveryUserDto)
  sender: DeliveryUserDto;

  @Type(() => DeliveryUserDto)
  receiver: DeliveryUserDto;

  @Exclude()
  messages: any;

  @Exclude()
  chargebackRequests: any;
}
