import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import fjwt from "@fastify/jwt";
import productRoutes from "./modules/product/product.route";
import swagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const serverOf: () => FastifyInstance = () => {
  const server = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
      level: "debug",
    },
  });

  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(fjwt, {
    secret: "supersecret",
  });
  server.addHook("preHandler", (req, res, next) => {
    // here we are
    req.jwt = server.jwt;
    return next();
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        return reply.send(error);
      }
    }
  );
  server.register(swagger);

  server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  server.register(productRoutes, { prefix: "/api/v1/products" });
  server.register(userRoutes, { prefix: "/api/v1/users" });
  server.get("/healthcheck", (request, reply) => {
    return reply.send({ message: "Success" });
  });
  server.get("/ping", async (request, reply) => {
    return reply.status(200).send({ msg: "pong" });
  });
  server.get("/hello", async (request, reply) => {
    return { status: "ok" };
  });

  return server;
};

export const serverStart: (
  port: number
) => (server: FastifyInstance) => Promise<FastifyInstance> =
  (port) => async (server) => {
    const listenAddress = "0.0.0.0";
    const fastifyConfig = {
      port: port,
      host: listenAddress,
    };

    await server.listen(fastifyConfig);

    return server;
  };
