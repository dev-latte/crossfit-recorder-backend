import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "id" })
  id: number;

  @Column({ default: "no_name" })
  @ApiProperty({ description: "사용자 이름" })
  name: string;

  @Column({ default: "" })
  @ApiProperty({ description: "소속 박스 코드" })
  boxCode: string;

  @Column({ default: 0 })
  @ApiProperty({ description: "크로스핏 레벨" })
  level: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty({ description: "등록 날짜" })
  registrationDate: Date;
}
