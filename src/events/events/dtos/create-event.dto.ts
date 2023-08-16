import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;
  @Type(() => Date)
  @IsDate()
  date: Date;
  @IsString()
  partner_id: string;
}
