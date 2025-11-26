import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PROJECT_ROLES_KEY } from './project.roles.decorator';
import { Reflector } from '@nestjs/core';
import { ProjectService } from './project.service';
import { ChangeRoleDto } from './dto/change-role.dto';

const ROLE_ODER = {
    [Role.ADMIN]: 0,
    [Role.VIEWER]: 1,
    [Role.MEMBER]: 2,
};

export class ProjectRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private projectService: ProjectService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(PROJECT_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new ForbiddenException('User not found');

        const projectId = Number(req.params.projectId) || Number(req.body.projectId) || Number(req.query.projectId);
        if (!projectId) throw new ForbiddenException('Project not found');

        // const project = await this.projectService.getProjectById(projectId);
        // if (!project) throw new ForbiddenException('Project not found');

        const userProject = user.projects.find((project) => project.id === projectId);
        if (!userProject) throw new ForbiddenException('User is not a member of the project');

        const userRole = ROLE_ODER[userProject.role];
        const requiredOder = ROLE_ODER[requiredRoles[0]];

        if (userRole <= requiredOder) return true;

        return false;
    }
        
}

