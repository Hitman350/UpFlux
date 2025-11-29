import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

// Ensure DATABASE_URL is set, use default if not
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/upflux";
}

export const prismaClient = new PrismaClient();
