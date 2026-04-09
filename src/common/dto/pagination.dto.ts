import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsPositive()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
