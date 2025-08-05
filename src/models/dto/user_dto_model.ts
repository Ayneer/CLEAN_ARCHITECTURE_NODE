export class UserDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;

  constructor(data: UserDto) {
    this.name = data.name;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
  }
}