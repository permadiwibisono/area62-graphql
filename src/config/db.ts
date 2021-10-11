import "dotenv/config"
import { appConfig } from "./app"

export const dbConfig = {
  dbName: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || "postgresql",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  debug: appConfig.env !== "production",
}
