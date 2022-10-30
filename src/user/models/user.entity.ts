import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "index" })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: "사용자 아이디" })
  userId: string;

  @Column()
  @ApiProperty({ description: "사용자 비밀번호" })
  password: string;

  @Column({ unique: true })
  @ApiProperty({ description: "사용자 이메일" })
  email: string;

  @Column({ default: "no_name" })
  @ApiProperty({ description: "사용자 이름" })
  name: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "등록 날짜" })
  registrationDate: Date;

  @Column({ default: true })
  @ApiProperty({ description: "아이디 활성화 여부" })
  activation: boolean;

  // @Column({ default: "" })
  // @ApiProperty({ description: "소속 박스 코드" })
  // boxCode: string;

  // @Column({ default: 0 })
  // @ApiProperty({ description: "크로스핏 레벨" })
  // level: number;
}
