import { FastifyInstance } from "fastify";
import { $ref } from "./product.schema";
import { create } from "domain";
import { createProductHandler, getProductHandler } from "./product.controller";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productResponseSchema"),
        },
      },
    },
    createProductHandler
  );
  server.get("/", {
    schema:{
        response:{
            200:$ref("productResponseSchema"),
        }
    }
  }, getProductHandler);
}
export default productRoutes;
