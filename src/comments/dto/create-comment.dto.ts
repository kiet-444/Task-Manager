import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content : string

    @IsInt()
    @IsNotEmpty()
    taskId : number

    @IsInt()
    @IsNotEmpty()
    userId : number
}
