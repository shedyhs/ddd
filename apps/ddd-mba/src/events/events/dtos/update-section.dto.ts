import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
