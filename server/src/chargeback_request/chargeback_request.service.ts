import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ChargebackRequestEntity } from './chargeback_request.entity';
import { CreateChargeBackDto } from './dto/createChargeBack.dto';
import { UpdateChargebackDto } from './dto/updateChargeback.dto';
import { ChargebackRequestResponseDto } from './dto/ChargebackRequestResponse.dto';
import { plainToInstance } from 'class-transformer';
import { DeliveryEntity } from '../delivery/delivery.entity';

@Injectable()
export class ChargebackRequestService {
  constructor(
    @InjectRepository(ChargebackRequestEntity)
    private readonly chargebackRequestRepository: Repository<ChargebackRequestEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
  ) {}

  private transformToDto(
    chargebackRequest: ChargebackRequestEntity,
  ): ChargebackRequestResponseDto {
    return plainToInstance(ChargebackRequestResponseDto, chargebackRequest, {
      excludeExtraneousValues: false,
    });
  }

  async getAllChargebackRequests(): Promise<ChargebackRequestResponseDto[]> {
    const chargebackRequests = await this.chargebackRequestRepository.find({
      where: { confirmed: IsNull() },
      relations: [
        'delivery',
        'delivery.sender',
        'delivery.receiver',
        'delivery.item',
      ],
    });
    return chargebackRequests.map((request) => this.transformToDto(request));
  }

  async getChargebackRequestById(
    id: number,
  ): Promise<ChargebackRequestResponseDto | null> {
    const chargebackRequest = await this.chargebackRequestRepository.findOne({
      where: { id },
      relations: [
        'delivery',
        'delivery.sender',
        'delivery.receiver',
        'delivery.item',
      ],
    });
    return chargebackRequest ? this.transformToDto(chargebackRequest) : null;
  }

  async createChargebackRequest(
    createChargebackRequestDto: CreateChargeBackDto,
    userId: number,
  ): Promise<ChargebackRequestResponseDto> {
    // Validate that the delivery exists and the user is the receiver
    const delivery = await this.deliveryRepository.findOne({
      where: { id: createChargebackRequestDto.delivery },
      relations: ['receiver'],
    });

    if (!delivery) {
      throw new ForbiddenException('Delivery not found');
    }

    if (delivery.receiver.id !== userId) {
      throw new ForbiddenException(
        'Only the delivery receiver can create a chargeback request',
      );
    }

    const newChargebackRequest = new ChargebackRequestEntity();
    Object.assign(newChargebackRequest, createChargebackRequestDto);
    const savedChargebackRequest =
      await this.chargebackRequestRepository.save(newChargebackRequest);
    const chargebackRequest = await this.chargebackRequestRepository.findOne({
      where: { id: savedChargebackRequest.id },
      relations: [
        'delivery',
        'delivery.sender',
        'delivery.receiver',
        'delivery.item',
      ],
    });
    if (!chargebackRequest) {
      throw new Error('Failed to create chargeback request');
    }
    return this.transformToDto(chargebackRequest);
  }

  async resolveChargebackRequest(
    id: number,
    updateChargebackDto: UpdateChargebackDto,
  ): Promise<ChargebackRequestResponseDto> {
    const chargebackRequest = await this.chargebackRequestRepository.findOne({
      where: { id },
      relations: [
        'delivery',
        'delivery.sender',
        'delivery.receiver',
        'delivery.item',
      ],
    });
    if (!chargebackRequest) {
      throw new Error('Chargeback request not found');
    }
    Object.assign(chargebackRequest, updateChargebackDto);
    const updatedChargebackRequest =
      await this.chargebackRequestRepository.save(chargebackRequest);
    return this.transformToDto(updatedChargebackRequest);
  }
}
