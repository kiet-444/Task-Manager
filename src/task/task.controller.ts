import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Task')
@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':taskId/accept')
  async acceptTask(@Param('taskId') taskId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.taskService.acceptTask(Number(taskId), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':taskId/cancel')
  async cancelTask(@Param('taskId') taskId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.taskService.cancelTask(Number(taskId), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':taskId/complete')
  async completeTask(@Param('taskId') taskId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.taskService.completeTask(Number(taskId), userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available')
  async getAvailableTasks(@Request() req: any) {
    const userId = req.user.id;
    return this.taskService.getAvailableTasks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyTasks(@Request() req: any) {
    const userId = req.user.id;
    return this.taskService.getMyTasks(userId);
  }

  @UseGuards(JwtAuthGuard) 
  @Get('completed')
  async getCompletedTasks(@Request() req: any) {
    const userId = req.user.id;
    return this.taskService.getCompletedTasks(userId);
  }

  @Get('filter')
  async filterByPriority(@Query('priority') priority: string) {
    return this.taskService.filterByPriority(priority);
  }

  @Get('sort')
  async sortByDueDate(@Query('order') order: 'asc' | 'desc' = 'asc') {
    return this.taskService.sortByDueDate(order);
  }
  
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.taskService.update( Number(id), updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
