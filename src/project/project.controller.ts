import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRolesGuard } from './project.roles.guard';
import { ProjectRoles } from './project.roles.decorator';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.user.id);
  }

  // get the project list of the logged in user
  @Get()
  async findAll(@Req() req) {
    return this.projectService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.projectService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    return this.projectService.update(+id, req.user.id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(Role.ADMIN)
  async remove(@Param('id') id: string, @Req() req) {
    return this.projectService.remove(+id, req.user.id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string, @Req() req) {
    return this.projectService.getMember(+id, req.user.id);
  }

  @Post(':id/members')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(Role.ADMIN)
  async addMembers(@Param('id') id: string, @Req() req) {
    return this.projectService.addMember(+id, req.user.id, req.body.members);
  }

  @Delete(':id/members')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(Role.ADMIN)
  async removeMembers(@Param('id') id: string, @Req() req) {
    return this.projectService.removeMember(+id, req.user.id, req.body.members);
  }
}
