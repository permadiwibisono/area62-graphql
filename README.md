# area62-graphql

🇮🇩 Indonesia Postal Code &amp; Area in graphql

## Main Schemas:

1. Country (example: `INDONESIA`)
2. Province (example: `SUMATERA BARAT`)
3. City (example: `PADANG`)
4. DistrictOne as Kecamatan in Bahasa (example: `PADANG UTARA`)
5. DistrictTwo as Kelurahan in Bahasa (example: `LOLONG BELANTI`)
6. PostalCode (example: `25136`)

### Writing Queries:

```graphql
{
  countryByCode(code: "ID") {
    code
    iso3
    name
    phoneCode
    emoji
  }
  provinces(filter: { name: { eq: "SUMATERA BARAT" } }) {
    id
    code
    name
    cities {
      id
      code
      name
      postal
    }
  }
}
```

The above GraphQL query will produce the following JSON response:

```json
{
  "data": {
    "countryByCode": {
      "code": "ID",
      "iso3": "IDN",
      "name": "INDONESIA",
      "phoneCode": "62",
      "emoji": "🇮🇩"
    },
    "provinces": [
      {
        "id": 3,
        "code": "13",
        "name": "SUMATERA BARAT",
        "cities": [
          {
            "id": 57,
            "code": "1301",
            "name": "KEPULAUAN MENTAWAI",
            "postal": "25700,25300"
          }
        ]
      }
    ]
  }
}
```

## Run

### Prerequisite

You may need install some of this:

1. Yarn (I prefer use this instead of npm)
2. PostgreSQL
3. clone this repo :)

### Setup ENV & install

```bash
cp .env.example .env
```

```bash
yarn install
```

Fill with valid values

### Database Migration

#### with _npx mikro-orm cli_ (recommended)

it will be store as `.ts` in `migration` table

```bash
npx mikro-orm migration:up
```

#### with ts-node _db:migrate:ts_ (recommended)

it will be store as `.ts` in `migration` table

```bash
yarn db:migrate:ts
```

#### with _db:migrate_ (in production use)

it will be store as `.js` in `migration` table

```bash
yarn db:migrate
```

### Run server (with `watch`) for development

```bash
yarn watch
```

```bash
yarn dev
```

GraphQL playground in `http://localhost:5000/graphql`

### Build

```bash
yarn build
```

### Run server for production

```bash
yarn start
```

## Idea & Inspiration:

Big thanks for this repos and tutorials 🍻

1. [Countries GraphQL API](https://github.com/trevorblades/countries)
2. [INDONESIA POSTAL CODE & AREA](https://github.com/ArrayAccess/Indonesia-Postal-And-Area)
3. [TypeGraphql + MikroORM Example](https://github.com/MichalLytek/type-graphql/blob/master/examples/mikro-orm)
4. [Graphql + MikroORM Example](https://github.com/driescroons/mikro-orm-graphql-example)
