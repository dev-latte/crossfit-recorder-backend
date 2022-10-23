import { IsNumber, IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly boxCode: string;
  @IsNumber()
  readonly level: number;
}
