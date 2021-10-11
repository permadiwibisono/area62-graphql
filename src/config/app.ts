import "dotenv/config"

export const appConfig = {
  stage: process.env.APP_STAGE || "local",
  env: process.env.NODE_ENV || "development",
}
