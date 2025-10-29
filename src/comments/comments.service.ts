import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCommentDto: CreateCommentDto) {
    const task = await this.databaseService.task.findUnique({
      where: { id: createCommentDto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');

    return this.databaseService.comment.create({
      data: {
        content: createCommentDto.content,
        user: { connect: { id: createCommentDto.userId } },
        task: { connect: { id: createCommentDto.taskId } },
      },
      include: { user: true },
    });
  }

  findAllByTask(taskId: number) {
    return this.databaseService.comment.findMany({
      where: { taskId: taskId },
      include: { user: { select: { name: true, email: true, id: true }} },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: number) {
    return this.databaseService.comment.delete({ where: { id } });
  }
}