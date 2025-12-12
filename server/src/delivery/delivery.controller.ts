import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { DeliveryEntity } from './delivery.entity';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';
import { CreateDeliveryDto } from './dto/createDelivery.dto';
import { UpdateDeliveryDto } from './dto/updateDelivery.dto';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getDeliveries(): Promise<DeliveryEntity[]> {
    return await this.deliveryService.getAllDeliveries();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDeliveryById(
    @Param('id') id: number,
    @User() user: UserPayload,
  ): Promise<DeliveryEntity> {
    const delivery = await this.deliveryService.getDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (
      user.userId !== delivery.sender.id &&
      user.userId !== delivery.receiver.id &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException('You do not have access to this delivery');
    }

    return delivery;
  }
  @Get('my-deliveries')
  @UseGuards(JwtAuthGuard)
  async getMyDeliveries(@User() user: UserPayload): Promise<DeliveryEntity[]> {
    const allDeliveries = await this.deliveryService.getAllDeliveries();
    return allDeliveries.filter(
      (delivery) =>
        delivery.sender.id === user.userId ||
        delivery.receiver.id === user.userId,
    );
  }
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createDelivery(
    @Body('delivery') deliveryData: CreateDeliveryDto,
  ): Promise<DeliveryEntity> {
    return await this.deliveryService.createDelivery(deliveryData);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateDelivery(
    @Param('id') id: number,
    @Body('delivery') updateData: UpdateDeliveryDto,
    @User() user: UserPayload,
  ): Promise<DeliveryEntity | null> {
    const delivery = await this.deliveryService.getDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    if (
      user.userId != delivery.sender.id &&
      user.userId != delivery.receiver.id &&
      user.role != 'admin'
    ) {
      throw new NotFoundException('Delivery not found');
    }
    return await this.deliveryService.updateDelivery(id, updateData);
  }
}
