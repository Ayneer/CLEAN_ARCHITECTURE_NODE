export class UserEntity {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  img?: string;
  
  constructor(props: UserEntity) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.img = props.img;
  }
}
