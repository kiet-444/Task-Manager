import { Controller, Post } from '@nestjs/common';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('run-now')
  async triggerReminders() {
    await this.remindersService.sendReminders();
    console.log('Reminders triggered manually.');
  }
}
    