import { IsString } from 'class-validator';

export class ChangeSpotLocationDto {
  @IsString()
  location: string;
}
