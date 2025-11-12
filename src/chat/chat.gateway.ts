import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // allow all origins
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`conversation_${data.conversationId}`);
    socket.emit('joinedRoom', data.conversationId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { senderId: number; conversationId: number; content: string },
  ) {
    const message = await this.chatService.createMessage(data);
    // send message to all clients in the room
    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('receiveMessage', message);
  }
}
