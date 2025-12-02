import { IsEmail, IsEnum, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class CreateInviteDto {

    @IsOptional()
    @IsEmail()
    email : string;

    @IsEnum(Role)
    role : Role;
}
