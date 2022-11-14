import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { User } from "src/user/models/user.interface";
import { JwtGuard } from "../guards/jwt.guard";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 유저 정보를 입력받아 데이터베이스에 저장합니다.
   *
   * @param user
   */
  @Post("register")
  register(@Body() user: CreateUserDTO) {
    return this.authService.registerAccount(user);
  }

  /**
   * 유저 정보를 입력받아 정보를 확인, 해당 유저 정보의 토큰을 반환합니다.
   *
   * @param user
   * @param res
   */
  @UseGuards(JwtGuard)
  @Post("login")
  login(@Body() user: User, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.login(user);
    accessToken.then(el => {
      res.cookie("Authentication", el.access_token, {
        domain: "localhost",
        path: "/",
        httpOnly: true,
      });
    });

    return accessToken;
  }

  // 여기부터
  @UseGuards(JwtGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
