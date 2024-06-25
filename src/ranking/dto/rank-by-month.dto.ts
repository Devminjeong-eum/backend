import { Transform } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class RequestRankingByMonthDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(2024) // NOTE : 서비스 시작 년도 2024년도
    @Max(new Date().getFullYear())
    year: number;

    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;
}