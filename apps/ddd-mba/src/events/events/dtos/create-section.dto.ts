import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  total_spots: number;

  @IsNumber()
  @IsNumber()
  @IsPositive()
  price: number;
}
