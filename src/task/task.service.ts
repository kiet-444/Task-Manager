import { Task } from './../../node_modules/.prisma/client/index.d';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class TaskService {
  constructor( private databaseService: DatabaseService ) {}

  create(createTaskDto: CreateTaskDto) {
    return this.databaseService.task.create({ 
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate,
        status: createTaskDto.status,
        completed: false,
        user: { connect: { id: createTaskDto.userId } }, // Associate task with user
      },
    });
  }
 
  getTaskById(id: number) {
    return this.databaseService.task.findUnique({
      where: { id },
      include: { user: true },
    });
  }
  findAll() {
    return this.databaseService.task.findMany({
      include: { user: true },
    });
  }
  
  async acceptTask(taskId: number, userId: number) {
    const task = await this.databaseService.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    if ((task as any).assignedToId)
      throw new BadRequestException('Task already assigned to another user');

    return this.databaseService.task.update({
      where: { id: taskId },
      data: ({ assignedToId: userId, status: 'IN_PROGRESS' } as any),
    });
  }

  async cancelTask(taskId: number, userId: number) {
    const task = await this.databaseService.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    if ((task as any).assignedToId !== userId)
      throw new BadRequestException('Task is not assigned to the user');

    return this.databaseService.task.update({
      where: { id: taskId },
      data: ({ assignedToId: null, status: 'PENDING' } as any),
    });
  }

  async completeTask(taskId: number, userId: number) {
    const task = await this.databaseService.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    if ((task as any).assignedToId !== userId)
      throw new BadRequestException('Task is not assigned to the user');

    return this.databaseService.task.update({
      where: { id: taskId },
      data: ({ completed: true, status: 'COMPLETED' } as any),
    });
  }

  async getAvailableTasks(userId: number) {
    return this.databaseService.task.findMany({
      where: { assignedToId: null  },
      include: { user: true },
    });
  }
  async getMyTasks(userId: number) {
    return this.databaseService.task.findMany({
      where: { assignedToId: userId },
      include: { user: true },
    });
  }

  async getCompletedTasks(userId: number) {
    return this.databaseService.task.findMany({
      where: { assignedToId: userId, completed: true },
      include: { user: true },
    });
  }

  findOne(id: number) {
    return this.databaseService.task.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.databaseService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  remove(id: number) {
    return this.databaseService.task.delete({
      where: { id },
    });
  }
}
