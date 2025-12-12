import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity } from './delivery.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/createDelivery.dto';
import { UpdateDeliveryDto } from './dto/updateDelivery.dto';
import { DeliveryResponseDto } from './dto/DeliveryResponseDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
  ) {}

  private transformToDto(delivery: DeliveryEntity): DeliveryResponseDto {
    return plainToInstance(DeliveryResponseDto, delivery, {
      excludeExtraneousValues: false,
    });
  }

  async getAllDeliveries(): Promise<DeliveryResponseDto[]> {
    const deliveries = await this.deliveryRepository.find({
      relations: ['sender', 'receiver', 'item'],
    });
    return deliveries.map((delivery) => this.transformToDto(delivery));
  }

  async getDeliveryById(id: number): Promise<DeliveryResponseDto | null> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'item'],
    });
    return delivery ? this.transformToDto(delivery) : null;
  }

  async createDelivery(
    deliveryData: CreateDeliveryDto,
  ): Promise<DeliveryResponseDto> {
    const newDelivery = new DeliveryEntity();
    Object.assign(newDelivery, deliveryData);
    const savedDelivery = await this.deliveryRepository.save(newDelivery);
    return this.transformToDto(savedDelivery);
  }

  async updateDelivery(
    id: number,
    updateData: UpdateDeliveryDto,
  ): Promise<DeliveryResponseDto | null> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'item'],
    });
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    Object.assign(delivery, updateData);
    const updatedDelivery = await this.deliveryRepository.save(delivery);
    return this.transformToDto(updatedDelivery);
  }

  async getUserDeliveries(userId: number): Promise<DeliveryResponseDto[]> {
    const deliveries = await this.deliveryRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver', 'item'],
    });
    return deliveries.map((delivery) => this.transformToDto(delivery));
  }

  async isUserPartOfDelivery(
    userId: number,
    deliveryId: number,
  ): Promise<boolean> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['sender', 'receiver'],
    });

    if (!delivery) {
      return false;
    }

    return delivery.sender.id === userId || delivery.receiver.id === userId;
  }
}
