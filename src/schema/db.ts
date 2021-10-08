import { MikroORM } from "@mikro-orm/core"
import config from "../mikro-orm.config"

const db = {
  connect: () => MikroORM.init(config),
}

export default db
