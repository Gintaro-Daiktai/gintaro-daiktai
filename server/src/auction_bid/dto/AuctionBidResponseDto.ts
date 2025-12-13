import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class AuctionBidUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  profile_picture: string;
}

@Exclude()
class AuctionBidAuctionDto {
  @Expose()
  id: number;

  @Expose()
  min_bid: number;

  @Expose()
  min_increment: number;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  auction_status: string;
}

@Exclude()
export class AuctionBidResponseDto {
  @Expose()
  id: number;

  @Expose()
  sum: number;

  @Expose()
  bid_date: Date;

  @Expose()
  @Type(() => AuctionBidUserDto)
  user: AuctionBidUserDto;

  @Expose()
  @Type(() => AuctionBidAuctionDto)
  auction: AuctionBidAuctionDto;
}
