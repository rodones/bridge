import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const port = process.env.RODONES_BRIDGE_PORT || 3333;
  const prefix = "/api";

  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    .useWebSocketAdapter(new WsAdapter(app))
    .setGlobalPrefix(prefix)
    .enableCors({
      origin: "*",
    });

  SwaggerModule.setup(
    "/docs",
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Rodones Bridge")
        // .setDescription("")
        .setVersion("1.0")
        .addOAuth2({
          type: "oauth2",
          scheme: "bearer",
          bearerFormat: "JWT",
          flows: { password: { tokenUrl: prefix + "/auth/login", scopes: {} } },
          in: "header",
        })
        .addTag("auth", "User related endpoints")
        .addTag("nodes", "Node related endpoints")
        .build(),
    ),
  );

  await app.listen(port, "0.0.0.0");

  Logger.log(`Listening at ${await app.getUrl()}`);
}

bootstrap();
