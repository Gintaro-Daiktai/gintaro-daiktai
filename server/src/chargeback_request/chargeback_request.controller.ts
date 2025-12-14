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
import { UpdateChargebackDto } from './dto/updateChargeback.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { UserPayload } from 'src/common/interfaces/user_payload.interface';

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
    @Body('chargeback_request')
    createChargebackRequestDto: CreateChargeBackDto,
    @User() user: UserPayload,
  ): Promise<ChargebackRequestResponseDto> {
    return await this.chargebackRequestService.createChargebackRequest(
      createChargebackRequestDto,
      user.userId,
    );
  }

  @Put(':id/resolve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async resolveChargebackRequest(
    @Param('id') id: number,
    @Body('chargeback_request')
    updateChargebackDto: UpdateChargebackDto,
  ): Promise<ChargebackRequestResponseDto> {
    return await this.chargebackRequestService.resolveChargebackRequest(
      id,
      updateChargebackDto,
    );
  }
}
