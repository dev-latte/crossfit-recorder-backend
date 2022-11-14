import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserEntity } from "src/user/models/user.entity";
import * as bcrypt from "../../utils/bcrypt.util";
import { User } from "src/user/models/user.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "name", "password", "activation", "role"],
    });
    let hashValid: boolean;
    await bcrypt
      .isHashValid(password, user.password)
      .then(el => (hashValid = el));
    delete user.password;
    return user && hashValid ? { ...user } : null;
  }

  async registerAccount(userData: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(userData.password);
    try {
      const createdUser = await this.userRepository.save({
        ...userData,
        password: hashedPassword,
      });
      delete createdUser.password;
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

  async login(user: User) {
    const { email, password } = user;
    let result: any;
    await this.validateUser(email, password).then(el => (result = el));
    console.log("login>> ", result);
    return { access_token: await this.jwtService.signAsync({ result }) };
  }
}
