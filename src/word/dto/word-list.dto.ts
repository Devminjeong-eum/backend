import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class RequestWordListDto {
    @IsString()
    @MinLength(3)
    keyword: string;

    @IsOptional()
    @IsUUID()
    userId?: string;
}