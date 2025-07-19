export class UserLoginDtoModel {
  email: string;
  password: string;

  constructor(data: UserLoginDtoModel) {
    this.email = data.email;
    this.password = data.password;
  }
}