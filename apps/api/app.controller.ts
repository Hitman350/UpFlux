import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { prismaClient } from "db/client";

@Controller()
export class AppController {
  @Get("health")
  healthCheck(@Res() res: Response) {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  }

  @Post("api/v1/website")
  async createWebsite(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const userId = req.userId!;
    const url = body.url;

    const data = await prismaClient.website.create({
      data: {
        userId,
        url,
      },
    });

    return res.json({
      id: data.id,
    });
  }

  @Get("api/v1/website/status")
  async getWebsiteStatus(
    @Req() req: Request,
    @Res() res: Response,
    @Query("websiteId") websiteId: string,
  ) {
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

    return res.json(data);
  }

  @Get("api/v1/websites")
  async getWebsites(@Req() req: Request, @Res() res: Response) {
    const userId = req.userId;

    const websites = await prismaClient.website.findMany({
      where: {
        userId,
        disabled: false,
      },
      include: {
        ticks: true,
      },
    });

    return res.json({
      websites,
    });
  }

  @Delete("api/v1/website")
  async deleteWebsite(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const websiteId = body.websiteId;
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

    return res.json({
      message: "Deleted website successfully",
    });
  }

  @Put("api/v1/website/pause")
  async pauseWebsite(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const websiteId = body.websiteId;
    const userId = req.userId;

    const website = await prismaClient.website.findFirst({
      where: {
        id: websiteId,
        userId,
        disabled: false,
      },
    });

    if (!website) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Website not found" });
    }

    const updated = await prismaClient.website.update({
      where: {
        id: websiteId,
        userId,
      },
      data: {
        paused: !website.paused,
      },
    });

    return res.json({
      message: updated.paused ? "Website paused" : "Website resumed",
      paused: updated.paused,
    });
  }
}
