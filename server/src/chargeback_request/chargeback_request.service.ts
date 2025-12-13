import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargebackRequestEntity } from './chargeback_request.entity';
import { CreateChargeBackDto } from './dto/createChargeBack.dto';
import { UpdateDeliveryDto } from './dto/updateChargeback.dto';
import { ChargebackRequestResponseDto } from './dto/ChargebackRequestResponse.dto';

@Injectable()
export class ChargebackRequestService {
  constructor(
    @InjectRepository(ChargebackRequestEntity)
    private readonly chargebackRequestRepository: Repository<ChargebackRequestEntity>,
  ) {}
  async getAllChargebackRequests(): Promise<ChargebackRequestResponseDto[]> {
    return await this.chargebackRequestRepository.find();
  }

  async getChargebackRequestById(
    id: number,
  ): Promise<ChargebackRequestResponseDto> {
    return await this.chargebackRequestRepository.findOneBy({ id });
  }

  async createChargebackRequest(
    createChargebackRequestDto: CreateChargeBackDto,
  ): Promise<ChargebackRequestResponseDto> {
    const newChargebackRequest = new ChargebackRequestEntity();
    Object.assign(newChargebackRequest, createChargebackRequestDto);
    return await this.chargebackRequestRepository.save(newChargebackRequest);
  }

  async resolveChargebackRequest(
    id: number,
    updateChargebackDto: UpdateDeliveryDto,
  ): Promise<ChargebackRequestResponseDto> {
    const chargebackRequest = await this.chargebackRequestRepository.findOneBy({
      id,
    });
    if (!chargebackRequest) {
      throw new Error('Chargeback request not found');
    }
    Object.assign(chargebackRequest, updateChargebackDto);
    return await this.chargebackRequestRepository.save(chargebackRequest);
  }
}
