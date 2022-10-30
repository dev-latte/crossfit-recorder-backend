import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userData: CreateUserDTO) {
    return this.userService.createUser(userData);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAllUsers();
  // }

  // @Get(":id")
  // findUser(@Param("id") id: number) {
  //   return this.userService.findOneUser(id);
  // }

  @Get(":email")
  findUser(@Param("email") email: string) {
    return this.userService.getByEmail(email);
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
