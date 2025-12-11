import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { DeliveryService } from '../delivery/delivery.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface JwtPayload {
  sub: number;
  email: string;
  role: 'admin' | 'client';
  confirmed: boolean;
}

interface SocketData {
  userId: number;
  email: string;
  role: 'admin' | 'client';
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessageGateway.name);
  private userSockets = new Map<number, Set<string>>();

  constructor(
    private readonly messageService: MessageService,
    private readonly deliveryService: DeliveryService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');

    server.use((socket, next) => {
      this.logger.log(`Middleware: Connection attempt from ${socket.id}`);
      this.logger.log(
        `Query params: ${JSON.stringify(socket.handshake.query)}`,
      );

      try {
        const token = this.extractToken(socket);
        if (!token) {
          this.logger.error('Middleware: No token provided');
          return next(new Error('No token provided'));
        }

        this.logger.log('Middleware: Token found, verifying...');
        const payload = this.jwtService.verify<JwtPayload>(token);

        socket.data = {
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
        };

        this.logger.log(`Middleware: Token verified for user ${payload.sub}`);
        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Middleware: Authentication failed: ${errorMessage}`);
        next(new Error(`Authentication failed: ${errorMessage}`));
      }
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { message: 'pong', timestamp: new Date() });
  }

  @SubscribeMessage('identity')
  handleIdentity(@ConnectedSocket() client: Socket) {
    const socketData = client.data as SocketData;
    client.emit('identity', {
      userId: socketData.userId,
      email: socketData.email,
      role: socketData.role,
    });
  }

  async handleConnection(client: Socket) {
    try {
      const socketData = client.data as SocketData;
      const userId = socketData.userId;

      this.logger.log(`Client connected: ${client.id}, User: ${userId}`);

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.add(client.id);
      }

      const deliveries = await this.deliveryService.getUserDeliveries(userId);
      for (const delivery of deliveries) {
        const roomName = `delivery_${delivery.id}`;
        await client.join(roomName);
      }

      this.logger.log(
        `User ${userId} joined ${deliveries.length} delivery rooms`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Connection setup failed: ${errorMessage}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const socketData = client.data as SocketData;
    const userId = socketData?.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinDelivery')
  async handleJoinDelivery(
    @MessageBody() data: { deliveryId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const socketData = client.data as SocketData;
      const userId = socketData.userId;
      const { deliveryId } = data;

      const hasAccess = await this.messageService.validateUserAccess(
        userId,
        deliveryId,
      );

      if (!hasAccess) {
        client.emit('error', {
          message: 'You do not have access to this delivery',
        });
        return;
      }

      const roomName = `delivery_${deliveryId}`;
      await client.join(roomName);

      this.logger.log(`User ${userId} joined delivery room ${deliveryId}`);
      client.emit('joinedDelivery', { deliveryId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Join delivery error: ${errorMessage}`);
      client.emit('error', { message: errorMessage });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const socketData = client.data as SocketData;
      const userId = socketData.userId;

      const message = await this.messageService.createMessage(
        createMessageDto,
        userId,
      );

      const roomName = `delivery_${createMessageDto.deliveryId}`;

      this.server.to(roomName).emit('messageReceived', {
        id: message.id,
        text: message.text,
        sendDate: message.send_date,
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          lastName: message.sender.last_name,
        },
        receiver: {
          id: message.receiver.id,
          name: message.receiver.name,
          lastName: message.receiver.last_name,
        },
        parentMessage: message.parentMessage
          ? {
              id: message.parentMessage.id,
              text: message.parentMessage.text,
              sender: {
                id: message.parentMessage.sender.id,
                name: message.parentMessage.sender.name,
              },
            }
          : null,
        deliveryId: createMessageDto.deliveryId,
      });

      client.emit('messageSent', { messageId: message.id });

      this.logger.log(
        `Message ${message.id} sent in delivery ${createMessageDto.deliveryId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Send message error: ${errorMessage}`);
      client.emit('error', { message: errorMessage });
    }
  }

  private extractToken(client: Socket): string | null {
    const tokenFromQuery = client.handshake.query.token;
    if (tokenFromQuery && typeof tokenFromQuery === 'string') {
      return tokenFromQuery;
    }

    return null;
  }
}
