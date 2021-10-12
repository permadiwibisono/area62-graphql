import csv from "csv-parser"
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import fetch from "node-fetch"
import { request } from "../utils"
import { Country } from "../schema/entities/country.entity"

interface Row {
  Name: string
  Code: string
  Latitude: string | null
  Longitude: string | null
}

interface ICountry {
  code: string
  name: string
  phone: string
  capital: string
  currency: string
  emoji: string
  emojiU: string
}

type Response = {
  data: {
    countries: ICountry[]
  }
}

export const url =
  "https://github.com/ArrayAccess/Indonesia-Postal-And-Area/raw/master/data/csv/62/countries.csv"

export const CountrySeeder = async (
  em: EntityManager<IDatabaseDriver<Connection>>
) => {
  const res = await request(url)
  const connection = em.getConnection()
  await em.begin()
  try {
    await connection.execute('ALTER TABLE "country" DISABLE TRIGGER ALL;')
    await connection.execute(
      'TRUNCATE table "country" RESTART IDENTITY CASCADE;'
    )
    await connection.execute('ALTER TABLE "country" ENABLE TRIGGER ALL;')
    const query = `
      query {
        countries(filter: { code: { eq: "ID" } }) {
          code
          name
          phone
          capital
          currency
          emoji
          emojiU
        }
      }
    `
    const countryFetch = await fetch("https://countries.trevorblades.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
    const {
      data: { countries },
    }: Response = await countryFetch.json()
    const first = countries[0]
    const country = em.create(Country, {
      name: first.name,
      code: first.code,
      iso3: "IDN",
      phoneCode: first.phone,
      capital: first.capital,
      currency: first.currency,
      emoji: first.emoji,
      emojiU: first.emojiU,
    })
    const p = new Promise<Row | null>((resolve, reject) => {
      let found: Row | null = null
      res.data
        .pipe(csv())
        .on("data", (data: Row) => {
          if (data.Code === "62") {
            found = data
          }
        })
        .on("end", () => resolve(found))
        .on("close", () => res.data.destroy())
        .on("error", (err: any) => reject(err))
    })

    const row = await p
    if (row) {
      country.name = row.Name
      country.ln = row.Latitude!
      country.lt = row.Longitude!
    }
    await em.persistAndFlush(country)
    await em.commit()
    return [country]
  } catch (error) {
    await em.rollback()
    console.log(error)
    throw error
  }
}
