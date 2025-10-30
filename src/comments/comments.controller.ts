import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }
  @Get('comment/:id')
  getCommentById(@Param('id') id: string) {
    return this.commentsService.getCommentById(+id);
  }
  
  @Get('task/:taskId')
  findAllByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findAllByTask(+taskId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(Number(id));
  }
}
