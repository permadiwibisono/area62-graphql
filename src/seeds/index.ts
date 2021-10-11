import { CountrySeeder } from "./country.seeder"
import { PostalCodeSeeder } from "./postalCode.seeder"
import { CitySeeder } from "./city.seeder"
import { ProvinceSeeder } from "./province.seeder"
import { DistrictOneSeeder } from "./districtOne.seeder"
import { DistrictTwoSeeder } from "./districtTwo.seeder"
import db from "../schema/db"

const seed = async () => {
  const orm = await db.connect()
  try {
    const { em } = orm
    await CountrySeeder(em.fork())
    await PostalCodeSeeder(em.fork())
    await ProvinceSeeder(em.fork())
    await CitySeeder(em.fork())
    await DistrictOneSeeder(em.fork())
    await DistrictTwoSeeder(em.fork())
    await orm.close()
  } catch (error) {
    console.log(error)
    await orm.close()
  }
}

// prettier-ignore
(async () => {
  console.log("[START] run seeder...")
  await seed()
  console.log("[DONE] run seeder...")
})()
