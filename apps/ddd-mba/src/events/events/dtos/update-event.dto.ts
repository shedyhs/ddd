import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
