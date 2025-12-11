import { Exclude, Transform, Type } from 'class-transformer';

export class UserSummaryDto {
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

  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Buffer.isBuffer(value)) {
      return value.toString('base64');
    }
    return value as string;
  })
  avatar?: string;
}

export class ItemSummaryDto {
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

export class ReviewEmoteDto {
  @Exclude()
  review: any;

  @Type(() => UserSummaryDto)
  user: UserSummaryDto;
}

export class ReviewResponseDto {
  @Type(() => UserSummaryDto)
  reviewer: UserSummaryDto;

  @Type(() => UserSummaryDto)
  reviewee: UserSummaryDto;

  @Type(() => ItemSummaryDto)
  item: ItemSummaryDto;

  @Type(() => ReviewEmoteDto)
  reviewEmotes?: ReviewEmoteDto[];
}
