import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
    @ApiProperty({ example: 'Task title', description: 'The title of the task' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'Task description', description: 'The description of the task' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The due date of the task' })
    @IsOptional()
    dueDate?: Date;

    @ApiProperty({ example: 'TODO', description: 'The status of the task' })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiProperty({description: 'The priority of the task',example: 'Low'})
    @IsOptional()
    priority?: TaskPriority; 
    
    @ApiProperty({ example: 1, description: 'The ID of the user who owns the task' })
    @IsNotEmpty()
    userId: number;
}
