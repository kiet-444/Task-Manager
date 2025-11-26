import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { Role } from '@prisma/client';


@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    const project = await this.databaseService.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        startDate: createProjectDto.startDate,
        endDate: createProjectDto.endDate,
        createById : userId,
        members: {
          create: {
            user: { connect: { id: userId } },
            role: Role.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return project;
  }

  async getMember (projectId: number, userId: number) {
    const project = await this.databaseService.project.findFirst({
      where: { id: projectId, members: { some: { userId } } },
    });
    return project;
  }

  async getProjectById(id: number) {
    const project = await this.databaseService.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findOne(projectId: number, userId: number) {
    const member = await this.getMember(projectId, userId);
    if (!member) throw new ForbiddenException('User is not a member of the project');
    
    const project = await this.databaseService.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findAll(userId: number) {
    const projects = await this.databaseService.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return projects;
  }

  async update(projectId: number, userId: number, updateProjectDto: UpdateProjectDto) {
    const member = await this.databaseService.projectMember.findFirst({   
     where: { projectId, userId },
   });

    if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');

    const updated = await this.databaseService.project.update({
      where: { id: projectId },
      data: {
        name: updateProjectDto.name,
        description: updateProjectDto.description,
        startDate: updateProjectDto.startDate,
        endDate: updateProjectDto.endDate,
      },
    });

    // Record an audit entry for this update. Use the ProjectAudit model (fields: projectId, userId, action).
    await (this.databaseService as any).projectAudit.create({
      data: {
        userId,
        projectId: updated.id,
        action: JSON.stringify(updateProjectDto),
      },
    });
    return updated;
  }

  // async update(projectId: number, userId: number, updateProjectDto: UpdateProjectDto) {
  //   const member = await this.databaseService.projectMember.findFirst({   
  //     where: { projectId, userId },
  //   });
  //   if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');
  //   return this.databaseService.project.update({ where: { id: projectId }, data: updateProjectDto });
  // }  

 //only admin can remove project
  async remove(projectId: number, userId: number) {
    const member = await this.databaseService.projectMember.findFirst({   
      where: { projectId, userId },
    });
    if (!member || member.role !== Role.ADMIN) throw new ForbiddenException('User is not an admin of the project');

    // Delete all tasks associated with the project
    await this.databaseService.task.updateMany({ 
      where: { projectId },
      data: {
        projectId : null
      }});
    
    await this.databaseService.projectMember.deleteMany({ where: { projectId } });
    const deleted = await this.databaseService.project.delete({ where: { id: projectId } });

    await this.databaseService.activity.create({
      data: {
        userId, 
        action: JSON.stringify(deleted),
        actionType  : 'DELETE_PROJECT'
      },
    })
    return { success : true };
  }

  //add member
  async addMember(projectId: number,userId: number,addMemberDto: AddMemberDto) {
  const member = await this.databaseService.projectMember.findFirst({
    where: { projectId, userId },
  });

  if (!member || member.role !== Role.ADMIN)
    throw new ForbiddenException('You are not an admin of this project');

  const userToAdd = await this.databaseService.user.findUnique({
    where: { id: addMemberDto.userId },
  });

  if (!userToAdd) {
    throw new BadRequestException('User does not exist');
  }

  const existingMember = await this.databaseService.projectMember.findFirst({
    where: {
      projectId: addMemberDto.projectId,
      userId: addMemberDto.userId,
    },
  });

  if (existingMember) {
    throw new BadRequestException('User is already a member of this project');
  }
 
  return this.databaseService.projectMember.create({
    data: {
      projectId: addMemberDto.projectId,
      userId: addMemberDto.userId,
      role: addMemberDto.role ?? Role.MEMBER, // Default to MEMBER if not provided
    },
  });
}

async removeMember(projectId: number, userId: number, memberId: number) {

  const requester = await this.databaseService.projectMember.findFirst({
    where: { projectId, userId },
  });

  if (!requester || requester.role !== Role.ADMIN) {
    throw new ForbiddenException('You are not an admin of this project');
  }

  const targetMember = await this.databaseService.projectMember.findFirst({
    where: { projectId, userId: memberId },
  });

  if (!targetMember) {
    throw new NotFoundException('Member not found in this project');
  }

  if (targetMember.role === Role.ADMIN) {
    const adminCount = await this.databaseService.projectMember.count({
      where: { projectId, role: Role.ADMIN },
    });

    if (adminCount <= 1) {
      throw new BadRequestException('Cannot remove the last admin of the project');
    }
  }

  // DELETE MEMBER
  await this.databaseService.projectMember.delete({
    where: { id: targetMember.id },
  });

  await (this.databaseService as any).projectAudit.create({
    data: {
      projectId,
      userId, 
      action: `Removed user ${memberId} from project ${projectId}`,
    },
  });

  return { message: 'Member removed successfully' };
}
    }



  


