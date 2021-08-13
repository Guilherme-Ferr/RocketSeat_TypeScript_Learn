import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

export class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    //Verificar se email existe
    const user = await usersRepositories.findOne({ email });

    if (!user) {
      throw new Error("Email/Passord incorrect");
    }

    //Verificar se senha esta correta
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email/Passord incorrect");
    }

    //Gerar token
    const token = sign(
      {
        email: user.email,
      },
      "6fa55b5c4a37d99c3ba4a600830fd9f8",
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );
    return token;
  }
}
