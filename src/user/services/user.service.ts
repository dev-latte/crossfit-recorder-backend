import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { UserEntity } from "../models/user.entity";
import * as bycrpt from "../../utils/bcrypt.util";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: CreateUserDTO) {
    const hashedPassword = await bycrpt.hash(userData.password);
    try {
      const createdUser = await this.userRepository.save({
        ...userData,
        password: hashedPassword,
      });
      createdUser.password = "비밀번호는 암호화되어 저장됩니다.";
      return createdUser;
    } catch (error) {
      // 23505 : unique 위반 규칙
      if (+error.code === 23505) {
        throw new BadRequestException(
          "사용자의 아이디 혹은 이메일이 이미 존재합니다.",
        );
      }
      throw new InternalServerErrorException("알 수 없는 오류가 발생했습니다.");
    }
  }

  findAllUsers() {
    const users = this.userRepository.find();
    if (!users) throw new NotFoundException("No Data of All Users.");
    return users;
  }

  /** 사용자 이메일을 체크. 이메일 값이 유니크가 된다. */
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Not foun Data by email : 「${email}」`);
    }
    return user;
  }

  findOneUser(id: number) {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Not found Data by Id : ${id}`);
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
