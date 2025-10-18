import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.databaseService.task.findMany();
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
