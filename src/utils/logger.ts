import pino from "pino"
import pinoHttp from "pino-http"

import { loggerConfig } from "../config"

export const logger = pino({
  level: loggerConfig.level,
})

export const httpLogger = pinoHttp({
  logger,
  useLevel: loggerConfig.level,
  // Set to `false` to prevent standard serializers from being wrapped.
  wrapSerializers: true,
  // Define a custom success message
  customSuccessMessage(res) {
    if (res.statusCode === 404) {
      return "resource not found"
    }
    return "request completed"
  },
  // Define a custom error message
  customErrorMessage(_error, res) {
    return `request errored with status code: ${res.statusCode}`
  },
})
