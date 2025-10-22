import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from '../task/task.service';
import dayjs from 'dayjs';
import { User } from '@prisma/client';

@Injectable()
export class RemindersService {
  private readonly reminderAdvanceDays = 2; // Send reminders 2 days before

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly taskService: TaskService,
  ) {}

  async sendReminderEmail(userEmail: string, task: any) {
    const existingTask = await this.taskService.getTaskById(task.id);
    if (!existingTask) throw new Error('Task not found');

    console.log(`Reminder sent to ${userEmail} for task "${task.title}"`);

    return this.databaseService.task.update({
      where: { id: task.id },
      data: { reminderSent: true },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendReminders() {
    // Use a date range for the target day to avoid time component mismatches
    const start = dayjs().add(this.reminderAdvanceDays, 'day').startOf('day').toDate();
    const end = dayjs().add(this.reminderAdvanceDays, 'day').endOf('day').toDate();

    const tasks = await this.databaseService.task.findMany({
      where: {
        dueDate: {
          gte: start,
          lte: end,
        },
        // NOTE: ensure `reminderSent` exists on your Prisma Task model; replace if named differently
        reminderSent: false,
      },
      include: {
        user: true,
      },
    });

    for (const task of tasks) {
      const userEmail = task.user?.email;
      if (userEmail) {
        await this.sendReminderEmail(userEmail, task);
      }
    }
  }
}
