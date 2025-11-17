import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const PROJECT_ROLES_KEY = 'projectRoles';
export const ProjectRoles = (...roles: Role[]) => SetMetadata(PROJECT_ROLES_KEY, roles);

export default ProjectRoles;