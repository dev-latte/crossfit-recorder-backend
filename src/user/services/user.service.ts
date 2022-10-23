import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { UserEntity } from "../models/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  createUser(userData: CreateUserDTO) {
    return this.userRepository.save(userData);
  }

  findAllUsers() {
    const users = this.userRepository.find();
    if (!users) throw new NotFoundException("No Data of All Users.");
    return users;
  }

  findOneUser(id: number) {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Not found Data by Id : ${id}.`);
    return user;
  }

  updateUser(id: number, userData: UpdateUserDTO) {
    this.findOneUser(id);
    return this.userRepository.update(id, userData);
  }

  deleteUser(id: number) {
    this.findOneUser(id);
    return this.userRepository.delete(id);
  }
}
