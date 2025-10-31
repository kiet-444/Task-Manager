import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCommentDto: CreateCommentDto) {
    const { content, userId, taskId, parentId } = createCommentDto;

    const task = await this.databaseService.task.findUnique({
      where: { id: taskId },
    });
    if (!task) throw new NotFoundException('Task not found');

    if (createCommentDto.parentId) { // check if parent comment exists , if not throw error 
      const parentComment = await this.databaseService.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) throw new NotFoundException('Parent comment not found');
    }

    return this.databaseService.comment.create({
      data: {
        content,
        user: { connect: { id: userId } },
        task: { connect: { id: taskId } },
        ...(parentId && { parent: { connect: { id: parentId } } }), 
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        parent: {
          include: { 
             user: { select: {id: true} },
           },
        },
      },
    });
  }

  async getCommentById(id: number) {
    const comment = await this.databaseService.comment.findUnique({
      where: { id },
      include: {
        user: true,
        parent: true,
        replies: {
          include: { user: true },
        },
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async findAllByTask(taskId: number) {
    return this.databaseService.comment.findMany({
      where: { taskId, parentId: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    const comment = await this.databaseService.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return this.databaseService.comment.delete({ where: { id } });
  }
}
