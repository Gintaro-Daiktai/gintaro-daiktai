import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargebackRequestController } from './chargeback_request.controller';
import { ChargebackRequestService } from './chargeback_request.service';
import { ChargebackRequestEntity } from './chargeback_request.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChargebackRequestEntity, DeliveryEntity]),
  ],
  controllers: [ChargebackRequestController],
  providers: [ChargebackRequestService],
  exports: [ChargebackRequestService],
})
export class ChargebackRequestModule {}
