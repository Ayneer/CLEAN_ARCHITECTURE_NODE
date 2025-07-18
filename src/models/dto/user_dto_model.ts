export class UserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
  img?: string;

  constructor(data: UserDto) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.img = data.img;
  }
}