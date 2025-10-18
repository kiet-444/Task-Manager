import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty( { example: 'john_doe', description: 'The username of the user' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty( { example: 'john@example.com', description: 'The email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty( { example: 'password123', description: 'The password of the user' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
