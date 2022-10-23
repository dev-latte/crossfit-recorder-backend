import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { CreateuserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { UserEntity } from "../models/user.entity";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userData: CreateuserDTO) {
    return this.userService.createUser(userData);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAllUsers();
  }

  @Get(":id")
  findUser(@Param("id") id: number) {
    return this.userService.findOneUser(id);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() userData: UpdateUserDTO) {
    return this.userService.updateUser(id, userData);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.userService.deleteUser(id);
  }
}
