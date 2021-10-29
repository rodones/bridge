import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { AuthModule } from "./auth/auth.module";
import { BridgeModule } from "./bridge/bridge.module";
import { NodeModule } from "./node/node.module";
import { ExceptionInterceptor } from "./app.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigService],
      useFactory: () => import("./mikro-orm.config").then((module) => module.default),
    }),
    AuthModule,
    BridgeModule,
    NodeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {}
