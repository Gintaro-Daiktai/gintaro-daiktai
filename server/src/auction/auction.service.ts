import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './auction.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/createAuction.dto';
import { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { UserService } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class AuctionService {
  private readonly logger = new Logger(AuctionService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
  ) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
    userPayload: UserPayload,
  ): Promise<AuctionEntity> {
    const user = await this.userService.findUserById(userPayload.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const startDate = new Date(createAuctionDto.start_date);
    const endDate = new Date(createAuctionDto.end_date);
    const now = new Date();

    if (startDate < now) {
      throw new BadRequestException('Start date cannot be in the past.');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date.');
    }

    const item = await this.itemService.findItemById(createAuctionDto.item);
    if (!item) {
      throw new NotFoundException(
        `Item with id ${createAuctionDto.item} not found.`,
      );
    }

    if (item.user.id !== userPayload.userId) {
      throw new ForbiddenException('You do not own this item.');
    }

    const existingAuction = await this.auctionRepository.findOne({
      where: { item: { id: item.id } },
      relations: { item: true },
    });

    if (existingAuction) {
      throw new ConflictException(
        `Item already has an auction (ID: ${existingAuction.id}).`,
      );
    }

    const auction_status = startDate <= now ? 'started' : 'created';

    const auction = this.auctionRepository.create({
      ...createAuctionDto,
      auction_status,
      user,
      item,
    });

    return this.auctionRepository.save(auction);
  }

  async findAllAuctions(
    relations: Record<string, boolean> = {},
  ): Promise<AuctionEntity[]> {
    return await this.auctionRepository.find({
      relations,
      order: { start_date: 'DESC' },
    });
  }

  async findAuctionById(
    id: number,
    relations: Record<string, boolean> = {},
  ): Promise<AuctionEntity | null> {
    return await this.auctionRepository.findOne({
      where: { id },
      relations,
    });
  }

  async cancelAuction(
    id: number,
    userPayload: UserPayload,
  ): Promise<AuctionEntity> {
    const auction = await this.findAuctionById(id, { user: true, item: true });

    if (!auction) {
      throw new NotFoundException(`Auction with id ${id} not found.`);
    }

    if (auction.user.id !== userPayload.userId) {
      throw new ForbiddenException(
        'You do not have permission to cancel this auction.',
      );
    }
    if (auction.auction_status === 'cancelled') {
      throw new ConflictException('Auction is already cancelled.');
    }

    if (auction.auction_status === 'sold') {
      throw new ConflictException('Cannot cancel a sold auction.');
    }

    auction.auction_status = 'cancelled';
    return this.auctionRepository.save(auction);
  }
}
