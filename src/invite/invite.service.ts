import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { DatabaseService } from 'src/database/database.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { Prisma } from '@prisma/client';
import {Role} from '@prisma/client'
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { create } from 'domain';

@Injectable()
export class InviteService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async sendInviteEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    
    const link = '${process.env.CLIENT_URL}/invite/accept/${token}';

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Task Manager Invite',
      text: `Please click the following link to accept the invite: ${link}`,
    });

  }

  async createInvite (projectId: number, userId: number, createInviteDto: CreateInviteDto) {
    const member = await this.databaseService.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');
    

    const token = randomBytes(32).toString('hex');

    const invite = await this.databaseService.projectInvite.create({
      data: {
        projectId,
        email: createInviteDto.email,
        role: createInviteDto.role,
        token,
        createdById: userId,
        expiresAt : new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    if (createInviteDto.email){
      const project = await this.databaseService.project.findUnique({
        where: { id: projectId },
      })
      await this.sendInviteEmail(createInviteDto.email, token);
    }

    return invite;
  }

  async getInvite (projectId: number , userId: number) {
    const member = await this.databaseService.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');
    
    return this.databaseService.projectInvite.findMany({
      where: { projectId },
    })
  }

   async acceptInvite(dto: AcceptInviteDto, userId: number) {
    const invite = await this.databaseService.projectInvite.findUnique({
      where: { token: dto.token },
    });

    if (!invite) throw new NotFoundException("Invalid token");
    if (invite.used) throw new BadRequestException("Invite already used");
    if (invite.expiresAt < new Date())
      throw new BadRequestException("Invite expired");

    // Check nếu user đã là member
    const exists = await this.databaseService.projectMember.findFirst({
      where: { projectId: invite.projectId, userId },
    });

    if (exists) throw new BadRequestException("You are already in this project");

    // Add vào project
    await this.databaseService.projectMember.create({
      data: {
        projectId: invite.projectId,
        userId,
        role: invite.role,
      },
    });

    // Mark invite used
    await this.databaseService.projectInvite.update({
      where: { id: invite.id },
      data: { used: true },
    });

    return { message: "Invite accepted successfully" };
  }

  async removeInvite(projectId: number, userId: number) {
    const member = await this.databaseService.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');
    
    return this.databaseService.projectInvite.deleteMany({
      where: { projectId },
    })
  }
}

  



