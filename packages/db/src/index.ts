import path from "node:path";
import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

// Load packages/db/.env regardless of which app is the process cwd (api, hub, prisma).
config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/upflux";
}

export const prismaClient = new PrismaClient();
