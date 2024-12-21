import prisma from "../../utils/prisma";
import { CreateProductSchemaInput } from "./product.schema";

export async function createProduct(
  data: CreateProductSchemaInput & { ownerId: number }
) {
  return prisma.product.create({
    data,
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    select: {
        title: true,
        content: true,
        price: true,
      },
    });
}