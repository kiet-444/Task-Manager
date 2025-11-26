import { IsInt, IsNotEmpty , IsEnum } from "class-validator";
import { Role } from "@prisma/client";
export class AddMemberDto {
    @IsInt()
    userId: number;
    
    @IsInt()
    @IsNotEmpty()
    projectId: number;
    
    @IsEnum(Role)
    role: Role
}