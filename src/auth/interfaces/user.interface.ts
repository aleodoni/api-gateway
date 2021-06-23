export interface User {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly name: string;
  readonly surname: string;
  readonly cpf: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly token: string;
}
