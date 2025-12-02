import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [InviteController],
  providers: [InviteService, DatabaseService],
})
export class InviteModule {}
