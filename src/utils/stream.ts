import { request as gaxios } from "gaxios"
import { Readable } from "stream"

export const request = (url: string) =>
  gaxios<Readable>({
    url,
    responseType: "stream",
  })
