import { Request, Response, NextFunction } from "express"
import { httpLogger } from "../utils"

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url === "/graphql") {
    return next()
  }
  return httpLogger(req, res, next)
}
