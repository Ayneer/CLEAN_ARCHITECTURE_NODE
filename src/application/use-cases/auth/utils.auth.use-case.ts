export interface UserToken {
  token: string;
  user: {
    name: string;
    email: string;
    id: string;
  };
}