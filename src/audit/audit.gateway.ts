import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class AuditGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const projectId = client.handshake.query.projectId;

    if (projectId) {
      client.join(`project-${projectId}`);
      console.log(`Client joined project-${projectId}`);
    }
  }

  emitLog(projectId: number, log: any) {
    this.server.to(`project-${projectId}`).emit('auditLog', log);
  }
}
