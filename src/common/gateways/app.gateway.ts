import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enable CORS for frontend access
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { chatId: string; sender: string; message: string },
  ) {
    this.server.to(data.chatId).emit('receivedMessage', data);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.chatId);
  }

  handleConnection(client: { id: string }) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: { id: string }) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
