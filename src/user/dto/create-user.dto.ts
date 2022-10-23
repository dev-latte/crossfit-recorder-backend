import { IsNumber, IsString } from "class-validator";

export class CreateuserDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly boxCode: string;
  @IsNumber()
  readonly level: number;
}
