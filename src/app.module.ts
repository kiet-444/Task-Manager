import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersModule } from './reminders/reminders.module';
import { CommentsModule } from './comments/comments.module';
import { ChatModule } from './chat/chat.module';
import { ProjectModule } from './project/project.module';



@Module({
  imports: [DatabaseModule, UserModule, TaskModule, AuthModule, ScheduleModule.forRoot(), RemindersModule, CommentsModule, ChatModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
