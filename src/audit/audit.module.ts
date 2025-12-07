import { Module } from '@nestjs/common';
import { AuditGateway } from './audit.gateway';
import { AuditService } from './audit.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AuditGateway, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
