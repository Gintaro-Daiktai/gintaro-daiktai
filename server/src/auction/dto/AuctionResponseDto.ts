import { Exclude, Transform, Type } from 'class-transformer';

export class AuctionUserDto {
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

export class AuctionItemDto {
  id: number;
  name: string;
  description: string;
  condition: 'new' | 'used' | 'worn' | 'broken';

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
  fk_lottery: number;

  @Exclude()
  user: any;

  @Exclude()
  itemTags: any;

  @Exclude()
  images: any;

  @Exclude()
  auction: any;

  @Exclude()
  reviews: any;

  @Exclude()
  deliveries: any;
}

export class AuctionBidDto {
  id: number;
  sum: number;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  })
  bid_date: Date;

  @Type(() => AuctionUserDto)
  user: AuctionUserDto;

  @Exclude()
  auction: any;
}

export class AuctionResponseDto {
  id: number;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  })
  start_date: Date;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  })
  end_date: Date;

  min_bid: number;
  min_increment: number;
  auction_status: 'started' | 'sold' | 'cancelled' | 'created';

  @Type(() => AuctionUserDto)
  user: AuctionUserDto;

  @Type(() => AuctionItemDto)
  item: AuctionItemDto;

  @Type(() => AuctionBidDto)
  auctionBids: AuctionBidDto[];
}
