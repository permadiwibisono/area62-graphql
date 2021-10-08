import { CountrySeeder } from "./country.seeder"
import { PostalCodeSeeder } from "./postalCode.seeder"
import { ProvinceSeeder } from "./province.seeder"
import db from "../schema/db"

const seed = async () => {
  try {
    const orm = await db.connect()
    const countries = await CountrySeeder(orm.em)
    console.log(countries)
    await PostalCodeSeeder(orm.em)
    await ProvinceSeeder(orm.em, countries)
    await orm.close()
  } catch (error) {
    console.log(error)
  }
}

// prettier-ignore
(async () => {
  console.log("[START] run seeder...")
  await seed()
  console.log("[DONE] run seeder...")
})()
