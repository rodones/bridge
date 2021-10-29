import { Options } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const logger = new Logger("MikroORM");

const config: Options = {
  type: "mariadb",
  host: process.env.RODONES_BRIDGE_DB_HOST,
  dbName: process.env.RODONES_BRIDGE_DB_DATABASE,
  port: Number(process.env.RODONES_BRIDGE_DB_PORT),
  user: process.env.RODONES_BRIDGE_DB_USERNAME,
  password: process.env.RODONES_BRIDGE_DB_PASSWORD,
  logger: logger.log.bind(logger),
  entities: ["dist/src/entities/**/*.entity.js"],
  entitiesTs: ["src/entities/**/*.entity.ts"],
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
