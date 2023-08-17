import { IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  customer_id: string;
  @IsString()
  section_id: string;
  @IsString()
  spot_id: string;
  @IsString()
  card_token: string;
}