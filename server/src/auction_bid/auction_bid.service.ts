import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuctionBidEntity } from './auction_bid.entity';
import { AuctionEntity } from 'src/auction/auction.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAuctionBidDto } from './dto/createAuctionBid.dto';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuctionBidService {
  private readonly logger = new Logger(AuctionBidService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(AuctionBidEntity)
    private readonly auctionBidRepository: Repository<AuctionBidEntity>,
    private readonly userService: UserService,
  ) {}

  async createAuctionBid(
    createAuctionBidDto: CreateAuctionBidDto,
    userPayload: UserPayload,
  ): Promise<AuctionBidEntity> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userService.findUserById(userPayload.userId);
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const auction = await manager.findOne(AuctionEntity, {
        where: { id: createAuctionBidDto.auction },
        relations: { user: true, item: true, auctionBids: true },
      });

      if (!auction) {
        throw new NotFoundException('Auction not found.');
      }

      if (auction.user.id === userPayload.userId) {
        throw new ForbiddenException('You cannot bid on your own auction.');
      }

      if (auction.auction_status !== 'started') {
        throw new ConflictException(
          `Auction is not active. Current status: ${auction.auction_status}`,
        );
      }

      const now = new Date();
      if (now < new Date(auction.start_date)) {
        throw new ConflictException('Auction has not started yet.');
      }

      if (now > new Date(auction.end_date)) {
        throw new ConflictException('Auction has ended.');
      }

      const highestBid = auction.auctionBids?.length
        ? Math.max(...auction.auctionBids.map((bid) => bid.sum))
        : 0;

      if (auction.min_bid && createAuctionBidDto.sum < auction.min_bid) {
        throw new BadRequestException(
          `Bid must be at least ${auction.min_bid}. You bid: ${createAuctionBidDto.sum}`,
        );
      }

      if (highestBid > 0) {
        const minimumBid = auction.min_increment
          ? highestBid + auction.min_increment
          : highestBid + 0.01;

        if (createAuctionBidDto.sum < minimumBid) {
          throw new BadRequestException(
            `Bid must be at least ${minimumBid} (current highest: ${highestBid}, min increment: ${auction.min_increment || 0.01}). You bid: ${createAuctionBidDto.sum}`,
          );
        }
      }

      if (user.balance < createAuctionBidDto.sum) {
        throw new BadRequestException(
          `Insufficient balance. Required: ${createAuctionBidDto.sum}, Available: ${user.balance}`,
        );
      }

      user.balance -= createAuctionBidDto.sum;
      await manager.save(user);

      const newAuctionBid = manager.create(AuctionBidEntity, {
        ...createAuctionBidDto,
        auction,
        user,
        bid_date: new Date(),
      });

      const savedBid = await manager.save(newAuctionBid);

      this.logger.log(
        `User ${user.id} placed bid of ${createAuctionBidDto.sum} on auction ${auction.id}. New balance: ${user.balance}`,
      );

      return savedBid;
    });
  }

  async findAuctionBidsByAuction(
    auctionId: number,
  ): Promise<AuctionBidEntity[]> {
    return await this.auctionBidRepository.find({
      where: { auction: { id: auctionId } },
      relations: { user: true },
      order: { bid_date: 'DESC' },
    });
  }
}
