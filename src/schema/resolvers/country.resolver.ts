import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { GraphQLContext } from "../../types"
import { Country } from "../entities/country.entity"
import { Province } from "../entities/province.entity"

@Resolver(() => Country)
export class CountryResolver {
  @Query(() => [Country!])
  countries(@Ctx() { em }: GraphQLContext): Promise<Country[]> {
    return em.find(Country, {})
  }

  @Query(() => Number)
  async countryCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(Country, {})
    return total
  }

  @FieldResolver()
  provinces(@Root() country: Country, @Ctx() { em }: GraphQLContext) {
    return em.find(Province, { country: { id: country.id } })
  }
}
