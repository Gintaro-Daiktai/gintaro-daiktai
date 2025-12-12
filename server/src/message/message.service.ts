import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
  ) {}

  async findMessagesByDeliveryId(deliveryId: number): Promise<MessageEntity[]> {
    return await this.messageRepository.find({
      where: { delivery: { id: deliveryId } },
      relations: [
        'sender',
        'receiver',
        'parentMessage',
        'parentMessage.sender',
      ],
      order: { send_date: 'ASC' },
    });
  }

  async getMessageById(messageId: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: [
        'sender',
        'receiver',
        'parentMessage',
        'parentMessage.sender',
        'replies',
        'replies.sender',
        'delivery',
      ],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: number,
  ): Promise<MessageEntity> {
    const deliveryId: number = createMessageDto.deliveryId;
    const receiverId: number = createMessageDto.receiverId;
    const parentMessageId: number | undefined =
      createMessageDto.parentMessageId;
    const text: string = createMessageDto.text;

    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['sender', 'receiver'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.sender.id !== senderId && delivery.receiver.id !== senderId) {
      throw new ForbiddenException('You are not part of this delivery');
    }

    const validReceiverId =
      delivery.sender.id === senderId
        ? delivery.receiver.id
        : delivery.sender.id;

    if (receiverId !== validReceiverId) {
      throw new BadRequestException('Invalid receiver for this delivery');
    }

    let parentMessage: MessageEntity | null = null;
    if (parentMessageId) {
      parentMessage = await this.messageRepository.findOne({
        where: { id: parentMessageId },
        relations: ['delivery'],
      });

      if (!parentMessage) {
        throw new NotFoundException('Parent message not found');
      }

      if (parentMessage.delivery.id !== deliveryId) {
        throw new BadRequestException(
          'Parent message does not belong to this delivery',
        );
      }
    }

    const newMessage = new MessageEntity();
    Object.assign(newMessage, {
      text,
      sender: { id: senderId },
      receiver: { id: receiverId },
      delivery: { id: deliveryId },
      parentMessage: parentMessageId ? { id: parentMessageId } : null,
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    return await this.getMessageById(savedMessage.id);
  }

  async validateUserAccess(
    userId: number,
    deliveryId: number,
  ): Promise<boolean> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['sender', 'receiver'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery.sender.id === userId || delivery.receiver.id === userId;
  }
}
