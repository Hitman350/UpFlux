import {
  Injectable,
  BadRequestException,
  RawBodyRequest,
} from "@nestjs/common";
import Stripe from "stripe";
import { prismaClient } from "db/client";
import type { Request } from "express";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-04-10" as any, // standard api version fallback
    });
  }

  async createSubscription(userId: string, email: string) {
    // 1. Check existing subscription in DB
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("User not found");

    if (
      user.subscriptionStatus === "TRIALING" ||
      user.subscriptionStatus === "ACTIVE"
    ) {
      throw new BadRequestException("You already have an active subscription");
    }

    // 2. Create or reuse Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({ email });
      customerId = customer.id;
      await prismaClient.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // 3. Create Subscription with 30-day trial and SetupIntent
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: process.env.STRIPE_PRO_PRICE_ID as string }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      trial_period_days: 30,
      expand: ["pending_setup_intent"],
    });

    const setupIntent = subscription.pending_setup_intent as Stripe.SetupIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: setupIntent.client_secret,
    };
  }

  async handleWebhook(req: RawBodyRequest<Request>) {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event: Stripe.Event;
    try {
      if (!req.rawBody) throw new Error("Missing rawBody");
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err: any) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await this.updateUserSubscriptionStatus(subscription);
        break;
      case "invoice.payment_failed":
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subId =
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription.id;
          const sub = await this.stripe.subscriptions.retrieve(subId);
          await this.updateUserSubscriptionStatus(sub);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  getStripeInstance() {
    return this.stripe;
  }

  public async updateUserSubscriptionStatusPublic(subscription: any) {
    await this.updateUserSubscriptionStatus(subscription);
  }

  private async updateUserSubscriptionStatus(subscription: any) {
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const user = await prismaClient.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`User not found for customer ${customerId}`);
      return;
    }

    const status = subscription.status.toUpperCase();
    let plan = user.plan;

    if (status === "TRIALING" || status === "ACTIVE") {
      plan = "PRO";
    } else if (
      status === "CANCELED" ||
      status === "UNPAID" ||
      status === "ENDED" ||
      status === "INCOMPLETE_EXPIRED"
    ) {
      plan = "FREE";
    }

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: status as any,
        subscriptionCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        plan: plan as any,
      },
    });
  }
}
