
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
// import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ DatabaseModule ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
