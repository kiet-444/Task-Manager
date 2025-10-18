import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}