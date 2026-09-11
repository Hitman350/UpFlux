import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { StripeController } from "./stripe.controller";
import { AuthMiddleware } from "./middleware";
import { StripeService } from "./stripe.service";

@Module({
  controllers: [AppController, StripeController],
  providers: [StripeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "api/v1/webhook/stripe", method: RequestMethod.POST })
      .forRoutes(
        { path: "api/v1/website", method: RequestMethod.POST },
        { path: "api/v1/website", method: RequestMethod.DELETE },
        { path: "api/v1/website/status", method: RequestMethod.GET },
        { path: "api/v1/websites", method: RequestMethod.GET },
        { path: "api/v1/website/pause", method: RequestMethod.PUT },
        { path: "api/v1/user/me", method: RequestMethod.GET },
        { path: "api/v1/subscription/create", method: RequestMethod.POST },
        { path: "api/v1/subscription/verify", method: RequestMethod.POST },
      );
  }
}
