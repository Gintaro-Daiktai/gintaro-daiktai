import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from '../common/interfaces/user_payload.interface';
import { MessageEntity } from './message.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('delivery/:deliveryId')
  async getMessagesByDelivery(
    @Param('deliveryId') deliveryId: number,
    @User() user: UserPayload,
  ): Promise<MessageEntity[]> {
    const hasAccess = await this.messageService.validateUserAccess(
      user.userId,
      deliveryId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this delivery');
    }

    return await this.messageService.findMessagesByDeliveryId(deliveryId);
  }

  @Get(':messageId')
  async getMessageById(
    @Param('messageId') messageId: number,
    @User() user: UserPayload,
  ): Promise<MessageEntity> {
    const message = await this.messageService.getMessageById(messageId);

    const hasAccess = await this.messageService.validateUserAccess(
      user.userId,
      message.delivery.id,
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this message');
    }

    return message;
  }
}
