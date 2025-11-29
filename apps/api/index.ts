import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";
import cors from "cors";

const app = express();

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // to read the req.body as express itself cannot read the json format

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!; // ! tells that userId will definitely exist and cannot be undefined due the authMiddleware
  const url = req.body.url;

  const data = await prismaClient.website.create({
    data: {
      userId,
      url,
    },
  });

  res.json({
    id: data.id, // This id is created by the uuid() given in the prisma
  });
}); // This will be used to add a new website

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as unknown as string; // query "websiteId" is present here like "/api/v1/website/status?websiteId=323"
  const userId = req.userId;

  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data);
}); // This will return the status(ticks) of the website

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const websites = await prismaClient.website.findMany({
    where: {
      userId, // "id:" not written as userId is a field in the website table
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json({
    websites,
  });
}); // This will return all existing websites

app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
  const websiteId = req.body.websiteId;
  const userId = req.userId;

  await prismaClient.website.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });

  res.json({
    message: "Deleted website successfully",
  });
}); // This will delete a website from the existing list

app.listen(8080);
