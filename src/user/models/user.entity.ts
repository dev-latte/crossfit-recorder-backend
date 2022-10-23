import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "no_name" })
  name: string;

  @Column({ default: "" })
  boxCode: string;

  @Column({ default: 0 })
  level: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  registrationDate: Date;
}
