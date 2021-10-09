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
    @Arg("populate", () => [String], { nullable: true }) populate: string[],
    @Ctx() { em }: GraphQLContext
  ): Promise<Country[]> {
    return em.find(Country, parseFilterInput<Country>(filter), {
      populate,
    })
  }

  @Query(() => Number)
  async countryCount(
    @Arg("filter", { nullable: true }) filter: CountryInput,
    @Ctx() { em }: GraphQLContext
  ) {
    const total = await em.count(Country, parseFilterInput<Country>(filter))
    return total
  }

  @FieldResolver()
  provinces(@Root() country: Country, @Ctx() { em }: GraphQLContext) {
    if (country.provinces.isInitialized()) {
      return country.provinces
    }
    return em.find(Province, { country: { id: country.id } })
  }
}
