import { Role } from "./role.enum";

export interface User {
  id?: number;
  email?: string;
  password?: string;
  name?: string;
  registrationDate?: Date;
  activation?: boolean;
  role?: Role;
}
