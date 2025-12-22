import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditGateway } from './audit.gateway';

@Injectable()
export class AuditService {
  constructor(
    private db: DatabaseService,
    private gateway: AuditGateway,
  ) {}

  async create(projectId: number, userId: number, action: string, meta?: any) {
    const log = await this.db.projectAudit.create({
      data: {
        projectId,
        userId,
        action,
        // meta: JSON.stringify(meta) //if want to store JSON
      },
    });

    this.gateway.emitLog(projectId, log);

    return log;
  }
}
