/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import "dotenv/config"
import "reflect-metadata"
import http from "http"
import App from "../app"

// prettier-ignore
const app = new App();

// prettier-ignore
(async () => {
  try {
    await app.connect()
    await app.init()
  } catch (error) {
    console.log("error boot app: ", error)
  }
})()

const { host } = app

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string) => {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "5000")
host.set("port", port)

/**
 * Create HTTP server.
 */

const server = http.createServer(host)

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address()
  const bind =
    typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr ? addr.port : port}`
  console.log(`Listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on("error", onError)
server.on("listening", onListening)
