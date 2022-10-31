import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/models/user.entity";
import { AuthController } from "./controllers/auth.controller";
import { JwtGuard } from "./guards/jwt.guard";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./guards/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: "3600s" },
      }),
    }),
  ],
  providers: [AuthService, JwtGuard, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
