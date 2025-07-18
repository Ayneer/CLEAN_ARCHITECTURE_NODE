interface UserEntityProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  img?: string;
}

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  img?: string;
  
  constructor(props: UserEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.img = props.img;
  }
}
