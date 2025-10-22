import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersModule } from './reminders/reminders.module';


@Module({
  imports: [DatabaseModule, UserModule, TaskModule, AuthModule, ScheduleModule.forRoot(), RemindersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
