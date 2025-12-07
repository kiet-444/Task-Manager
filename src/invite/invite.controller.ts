import { create } from 'domain';
import { Controller, Req, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post(":id/invite")

  createInvite(@Param("id") id: number, @Body() createInviteDto: CreateInviteDto, @Req() req,) {
    return this.inviteService.createInvite(id, req.user.id, createInviteDto);
  }

  @Post(":id/accept")
  acceptInvite(@Param("id") id: number, @Body() acceptInviteDto: AcceptInviteDto, @Req() req,) {
    return this.inviteService.acceptInvite(acceptInviteDto, req.user.id);
  }
  
  @Post(':inviteId/resend')
  resend(
  @Param('projectId') projectId: number,
  @Param('inviteId') inviteId: number,
  @Req() req,
  ){
  return this.inviteService.resendInvite(Number(projectId), req.user.id, Number(inviteId));
  }


  @Get(":id")
  getInvite(@Param("id") id: number, @Req() req,) {
    return this.inviteService.getInvite(id, req.user.id);
  }

  @Delete(":id")
  removeInvite(@Param("id") id: number, @Req() req,) {
    return this.inviteService.removeInvite(id, req.user.id);
  }

}
