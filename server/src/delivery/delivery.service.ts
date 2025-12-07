import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryEntity } from './delivery.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/createDelivery.dto';
import { UpdateDeliveryDto } from './dto/updateDelivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
  ) {}

  async getAllDeliveries(): Promise<DeliveryEntity[]> {
    return await this.deliveryRepository.find();
  }
  async getDeliveryById(id: number): Promise<DeliveryEntity | null> {
    return await this.deliveryRepository.findOneBy({ id });
  }
  async createDelivery(
    deliveryData: CreateDeliveryDto,
  ): Promise<DeliveryEntity> {
    const newDelivery = new DeliveryEntity();
    Object.assign(newDelivery, deliveryData);
    return await this.deliveryRepository.save(newDelivery);
  }
  async updateDelivery(
    id: number,
    updateData: UpdateDeliveryDto,
  ): Promise<DeliveryEntity | null> {
    const delivery = await this.getDeliveryById(id);
    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    Object.assign(delivery, updateData);
    return await this.deliveryRepository.save(delivery);
  }
}
