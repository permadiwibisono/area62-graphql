import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { parseFilterInput } from "../../utils/query"
import { GraphQLContext } from "../../types"
import { Country } from "../entities/country.entity"
import { Province } from "../entities/province.entity"
import { CountryInput } from "../inputs/country.input"

@Resolver(() => Country)
export class CountryResolver {
  @Query(() => [Country!])
  countries(
    @Arg("filter", { nullable: true }) filter: CountryInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<Country[]> {
    return em.find(Country, parseFilterInput<Country>(filter))
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
