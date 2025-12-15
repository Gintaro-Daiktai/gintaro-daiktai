import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { TagEntity } from '../tag/tag.entity';
import { ImageEntity } from '../image/image.entity';
import { ReviewEntity } from '../review/review.entity';
import { MessageEntity } from '../message/message.entity';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    @InjectRepository(AuctionBidEntity)
    private readonly auctionBidRepository: Repository<AuctionBidEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
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

  async seedDatabase(): Promise<void> {
    this.logger.log('Starting database seeding...');

    // Check if data already exists
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 1) {
      // More than just admin
      this.logger.log('Database already contains user data. Skipping seeding.');
      return;
    }

    const saltRounds = 10;

    // Step 1: Create 5 users
    this.logger.log('Creating 5 users...');
    const users: UserEntity[] = [];
    const userNames = [
      { name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
      { name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
      {
        name: 'Mantas',
        last_name: 'Jurgelaitis',
        email: 'mantas.jurgelaitis@example.com',
      },
      {
        name: 'Šarūnas',
        last_name: 'Butnevičius',
        email: 'sarunas.butnevicius@example.com',
      },
      {
        name: 'David',
        last_name: 'Williams',
        email: 'david.williams@example.com',
      },
    ];

    for (const userData of userNames) {
      const hashedPassword = await hash('Password123!', saltRounds);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role: 'client',
        phone_number: `+370${Math.floor(Math.random() * 90000000 + 10000000)}`,
        balance: Math.random() * 1000 + 100, // Random balance between 100-1100
        confirmed: true,
        registration_date: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        ), // Random date within last year
        birth_date: new Date(
          1970 + Math.floor(Math.random() * 35),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
      });
      const savedUser = await this.userRepository.save(user);
      users.push(savedUser);
    }
    this.logger.log(`Created ${users.length} users`);

    // Step 2: Create tags
    this.logger.log('Creating tags...');
    const tagNames = [
      'Electronics',
      'Furniture',
      'Clothing',
      'Books',
      'Toys',
      'Sports',
      'Home',
      'Garden',
      'Vintage',
      'Collectible',
      'Antique',
      'Modern',
      'Handmade',
      'Rare',
      'Limited Edition',
    ];
    const tags: TagEntity[] = [];
    for (const tagName of tagNames) {
      const existingTag = await this.tagRepository.findOne({
        where: { name: tagName },
      });
      if (!existingTag) {
        const tag = this.tagRepository.create({ name: tagName });
        const savedTag = await this.tagRepository.save(tag);
        tags.push(savedTag);
      } else {
        tags.push(existingTag);
      }
    }
    this.logger.log(`Created ${tags.length} tags`);

    // Step 3: Create 50 items (10 per user)
    this.logger.log('Creating 50 items...');
    const items: ItemEntity[] = [];
    const itemConditions: Array<'new' | 'used' | 'worn' | 'broken'> = [
      'new',
      'used',
      'worn',
      'broken',
    ];
    const itemTemplates = [
      'Vintage Watch',
      'Gaming Console',
      'Designer Bag',
      'Antique Vase',
      'Leather Jacket',
      'Smart Phone',
      'Collectible Coin',
      'Oak Dining Table',
      'Mountain Bike',
      'Camera Lens',
      'Signed Baseball',
      'Rare Book',
      'Persian Rug',
      'Gold Necklace',
      'Art Painting',
      'Vinyl Record',
      'Mechanical Keyboard',
      'Telescope',
      'Guitar',
      'Skateboard',
    ];

    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      const user = users[userIndex];
      for (let i = 0; i < 10; i++) {
        const itemIndex = (userIndex * 10 + i) % itemTemplates.length;
        const itemName = `${itemTemplates[itemIndex]} #${userIndex * 10 + i + 1}`;

        // Create a simple placeholder image
        const imageBuffer = Buffer.from(
          `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
          'base64',
        );
        const image = this.imageRepository.create({
          image: imageBuffer,
          mimeType: 'image/png',
        });
        const savedImage = await this.imageRepository.save(image);

        // Assign 1-3 random tags to each item
        const itemTags = this.getRandomElements(
          tags,
          Math.floor(Math.random() * 3) + 1,
        );

        const item = this.itemRepository.create({
          name: itemName,
          description: `This is a ${itemConditions[Math.floor(Math.random() * itemConditions.length)]} ${itemName}. Great condition and ready for a new owner!`,
          condition:
            itemConditions[Math.floor(Math.random() * itemConditions.length)],
          weight: Math.random() * 10 + 0.1,
          length: Math.random() * 100 + 10,
          width: Math.random() * 100 + 10,
          height: Math.random() * 100 + 10,
          view_count: Math.floor(Math.random() * 500),
          user: user,
          image: savedImage,
          tags: itemTags,
          creation_date: new Date(
            Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
          ), // Random date within last 6 months
        });

        const savedItem = await this.itemRepository.save(item);
        items.push(savedItem);
      }
    }
    this.logger.log(`Created ${items.length} items`);

    // Step 4: Create 15 auctions (some started, some created, some with bids)
    this.logger.log('Creating auctions...');
    const auctions: AuctionEntity[] = [];
    const auctionStatuses: Array<'started' | 'created'> = [
      'started',
      'created',
    ];

    // Select 15 random items for auctions (ensure they belong to different users for variety)
    const auctionItems = this.getRandomElements(items, 15);

    for (let i = 0; i < auctionItems.length; i++) {
      const item = auctionItems[i];
      const status = auctionStatuses[Math.floor(Math.random() * 2)];
      const startDate =
        status === 'started'
          ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) // Started in last 10 days
          : new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Starts in next 30 days

      const endDate = new Date(
        startDate.getTime() + (5 + Math.random() * 10) * 24 * 60 * 60 * 1000,
      ); // 5-15 days duration

      const auction = this.auctionRepository.create({
        start_date: startDate,
        end_date: endDate,
        min_bid: Math.floor(Math.random() * 500) + 50,
        min_increment: Math.floor(Math.random() * 50) + 5,
        auction_status: status,
        user: item.user,
        item: item,
      });

      const savedAuction = await this.auctionRepository.save(auction);
      auctions.push(savedAuction);
    }
    this.logger.log(`Created ${auctions.length} auctions`);

    // Step 5: Create auction bids for started auctions
    this.logger.log('Creating auction bids...');
    const startedAuctions = auctions.filter(
      (a) => a.auction_status === 'started',
    );
    let totalBids = 0;

    for (const auction of startedAuctions) {
      const numBids = Math.floor(Math.random() * 5) + 1; // 1-5 bids per auction
      let currentBid = auction.min_bid;

      for (let i = 0; i < numBids; i++) {
        // Select a random user who is NOT the auction owner
        const bidder = users.find((u) => u.id !== auction.user.id);
        if (!bidder) continue;

        currentBid += auction.min_increment + Math.random() * 50;

        const bid = this.auctionBidRepository.create({
          sum: currentBid,
          bid_date: new Date(
            auction.start_date.getTime() +
              Math.random() * (Date.now() - auction.start_date.getTime()),
          ),
          auction: auction,
          user: bidder,
        });

        await this.auctionBidRepository.save(bid);
        totalBids++;
      }
    }
    this.logger.log(`Created ${totalBids} auction bids`);

    // Step 6: Create deliveries (for sold items / completed transactions)
    this.logger.log('Creating deliveries...');
    const deliveries: DeliveryEntity[] = [];
    const deliveryStatuses: Array<
      'processing' | 'delivering' | 'delivered' | 'cancelled'
    > = ['processing', 'delivering', 'delivered', 'cancelled'];

    // Create deliveries for items not in auctions
    const nonAuctionItems = items.filter(
      (item) => !auctionItems.some((ai) => ai.id === item.id),
    );
    const deliveryItems = this.getRandomElements(
      nonAuctionItems,
      Math.min(10, nonAuctionItems.length),
    );

    for (const item of deliveryItems) {
      // Sender is the item owner, receiver is a different random user
      const sender = item.user;
      const receiver = users.find((u) => u.id !== sender.id);
      if (!receiver) continue;

      const status =
        deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];

      const delivery = this.deliveryRepository.create({
        order_date: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
        ), // Within last 60 days
        order_status: status,
        item: item,
        sender: sender,
        receiver: receiver,
      });

      const savedDelivery = await this.deliveryRepository.save(delivery);
      deliveries.push(savedDelivery);
    }
    this.logger.log(`Created ${deliveries.length} deliveries`);

    // Step 7: Create messages for deliveries
    this.logger.log('Creating messages...');
    let totalMessages = 0;

    for (const delivery of deliveries) {
      const numMessages = Math.floor(Math.random() * 5) + 1; // 1-5 messages per delivery

      for (let i = 0; i < numMessages; i++) {
        const isSenderMessage = Math.random() > 0.5;
        const sender = isSenderMessage ? delivery.sender : delivery.receiver;
        const receiver = isSenderMessage ? delivery.receiver : delivery.sender;

        const messageTexts = [
          'When will the item be shipped?',
          'Item has been shipped today!',
          'Can you provide tracking information?',
          'Here is the tracking number: ABC123456',
          'Is the item as described?',
          'Yes, everything looks great!',
          'Thank you for the quick delivery!',
          'Payment has been processed.',
        ];

        const message = this.messageRepository.create({
          text: messageTexts[Math.floor(Math.random() * messageTexts.length)],
          send_date: new Date(
            delivery.order_date.getTime() +
              Math.random() * 10 * 24 * 60 * 60 * 1000,
          ),
          sender: sender,
          receiver: receiver,
          delivery: delivery,
        });

        await this.messageRepository.save(message);
        totalMessages++;
      }
    }
    this.logger.log(`Created ${totalMessages} messages`);

    // Step 8: Create reviews for delivered items
    this.logger.log('Creating reviews...');
    const deliveredDeliveries = deliveries.filter(
      (d) => d.order_status === 'delivered',
    );
    let totalReviews = 0;

    for (const delivery of deliveredDeliveries) {
      // Create review from receiver about the seller (item owner)
      const review = this.reviewRepository.create({
        title: 'Great transaction!',
        body: 'The item was exactly as described. Fast shipping and great communication!',
        rating: Math.floor(Math.random() * 3) + 3, // Rating 3-5
        review_date: new Date(
          delivery.order_date.getTime() + 15 * 24 * 60 * 60 * 1000,
        ), // 15 days after order
        reviewer: delivery.receiver,
        reviewee: delivery.sender,
        item: delivery.item,
      });

      await this.reviewRepository.save(review);
      totalReviews++;
    }
    this.logger.log(`Created ${totalReviews} reviews`);

    this.logger.log('Database seeding completed successfully!');
    this.logger.log('Summary:');
    this.logger.log(`  - Users: ${users.length}`);
    this.logger.log(`  - Items: ${items.length}`);
    this.logger.log(`  - Tags: ${tags.length}`);
    this.logger.log(`  - Auctions: ${auctions.length}`);
    this.logger.log(`  - Auction Bids: ${totalBids}`);
    this.logger.log(`  - Deliveries: ${deliveries.length}`);
    this.logger.log(`  - Messages: ${totalMessages}`);
    this.logger.log(`  - Reviews: ${totalReviews}`);
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }
}
