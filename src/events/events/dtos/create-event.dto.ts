import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;
  @Type(() => Date)
  date: Date;
  @IsString()
  partner_id: string;
}
