import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { verifyPassword } from "../../utils/hash";
import { serverOf } from "../../server";
import exp from "constants";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}
export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  //find a user with the email
  const user = await findUserByEmail(body.email);
  if (!user) {
    return reply.code(401).send({ message: "Invalid email or password" });
  }
  //verify password
  const correctPassword = verifyPassword(
    body.password,
    user.salt,
    user.password
  );

  if (correctPassword) {
    const { password, salt, ...rest } = user;
    // generate access token
    return { accessToken: request.jwt.sign(rest)};
  }

  return reply.code(401).send({
    message: "Invalid email or password",
  });

  //response
}

export async function getUserHandler(){
  const users = await findUsers();
  return users;
}