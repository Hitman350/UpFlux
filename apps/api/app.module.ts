import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "./middleware";

@Module({
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "api/v1/website", method: RequestMethod.POST },
        { path: "api/v1/website", method: RequestMethod.DELETE },
        { path: "api/v1/website/status", method: RequestMethod.GET },
        { path: "api/v1/websites", method: RequestMethod.GET },
        { path: "api/v1/website/pause", method: RequestMethod.PUT },
      );
  }
}
