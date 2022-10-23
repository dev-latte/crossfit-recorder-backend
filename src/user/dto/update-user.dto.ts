import { PartialType } from "@nestjs/mapped-types";
import { CreateuserDTO } from "./create-user.dto";

export class UpdateUserDTO extends PartialType(CreateuserDTO) {}
