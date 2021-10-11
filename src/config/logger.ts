import pino, { Level } from "pino"
import { appConfig } from "./app"

type Options = pino.LoggerOptions & { level: Level }

export const loggerConfig: Options = {
  level: appConfig.env === "production" ? "info" : "debug",
}
