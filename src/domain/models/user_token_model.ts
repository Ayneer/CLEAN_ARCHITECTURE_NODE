import { UserEntity } from "../entities/user.entity";

interface UserTOkenProps {
  token: string;
  user: Partial<UserEntity>;
}

export class UserTokenModel {
  token: string;
  user: Partial<UserEntity>;

  constructor(props: UserTOkenProps) {
    this.token = props.token;
    this.user = props.user;
  }
}
