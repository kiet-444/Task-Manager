import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatService {
  constructor(private prisma: DatabaseService) {}

  async createMessage(data: { senderId: number; conversationId: number; content: string }) {

    let conversation = await this.prisma.conversation.findFirst({
      where: { id: data.conversationId },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { participants: { create: { userId: data.senderId } } },
      });
    }

    const message = await this.prisma.message.create({
      data: {
        senderId: data.senderId,
        conversationId: data.conversationId,
        content: data.content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        conversation: { include: { participants: { include: { user: true } } } },
      },
    });
    return message;
  }

  async getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserConversations(userId: number) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }
}
