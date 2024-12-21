import { JWT } from "@fastify/jwt";
declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
  export interface FastifyRequest {
    jwt: JWT;
  }
}
type UserPayload = {
  id: number;
  email: string;
  name: string;
};
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
  }
}
