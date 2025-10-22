import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { TaskModule } from 'src/task/task.module';
import { RemindersController } from './reminders.controller';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  providers: [RemindersService],
  controllers: [RemindersController]
})
export class RemindersModule {}
