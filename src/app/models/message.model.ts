import { User } from "./user.model";

export interface Message {
  body?: string;
  author: Partial<User>;
}
