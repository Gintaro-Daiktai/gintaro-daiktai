import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChargebackRequestService } from './chargeback_request.service';
import { ChargebackRequestResponseDto } from './dto/ChargebackRequestResponse.dto';
import { CreateChargeBackDto } from './dto/createChargeBack.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateDeliveryDto } from './dto/updateChargeback.dto';

@Controller('chargeback-requests')
export class ChargebackRequestController {
  constructor(
    private readonly chargebackRequestService: ChargebackRequestService,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getChargebackRequests(): Promise<ChargebackRequestResponseDto[]> {
    return await this.chargebackRequestService.getAllChargebackRequests();
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async createChargebackRequest(
    @Body('chargebackRequest')
    createChargebackRequestDto: CreateChargeBackDto,
  ): Promise<ChargebackRequestResponseDto> {
    return await this.chargebackRequestService.createChargebackRequest(
      createChargebackRequestDto,
    );
  }
  @Put(':id/resolve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async resolveChargebackRequest(
    @Param('id') id: number,
    @Body('chargebackRequest')
    updateChargebackDto: UpdateDeliveryDto,
  ): Promise<ChargebackRequestResponseDto> {
    const chargebackRequest = await this.getChargebackRequestById(id);
    if (!chargebackRequest) {
      throw new Error('Chargeback request not found');
    }
    return await this.chargebackRequestService.resolveChargebackRequest(
      id,
      updateChargebackDto,
    );
  }
}
