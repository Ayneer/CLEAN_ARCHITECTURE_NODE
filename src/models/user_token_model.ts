import { UserEntity } from "../domain/entities/user.entity";

export class UserTokenModel {
  token: string;
  user: Partial<UserEntity>;

  constructor(props: UserTokenModel) {
    this.token = props.token;
    this.user = props.user;
  }
}
