import { Controller, Post, Req, Res, Body, Inject } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import type { Request, Response } from "express";
import { StripeService } from "./stripe.service";
import { prismaClient } from "db/client";

@Controller()
export class StripeController {
  constructor(
    @Inject(StripeService) private readonly stripeService: StripeService,
  ) {}

  @Post("api/v1/subscription/create")
  async createSubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    try {
      const userId = req.userId!;
      const email = body?.email || "";

      let user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        user = await prismaClient.user.create({
          data: {
            id: userId,
            email: email,
          },
        });
      }

      const result = await this.stripeService.createSubscription(
        userId,
        user.email,
      );
      return res.json(result);
    } catch (error: any) {
      console.error("Subscription create error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  @Post("api/v1/subscription/verify")
  async verifySubscription(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    try {
      const userId = req.userId!;
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      if (!user || !user.stripeCustomerId) {
        return res.json({ success: false });
      }

      // We proactively fetch their subscriptions from Stripe and update our DB.
      // This is a safety net in case local webhooks are not running.
      const subscriptions = await this.stripeService.getStripeInstance().subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        await this.stripeService.updateUserSubscriptionStatusPublic(subscriptions.data[0]);
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error("Subscription verify error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  @Post("api/v1/webhook/stripe")
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.stripeService.handleWebhook(req);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
