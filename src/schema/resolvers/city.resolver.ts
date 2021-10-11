import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { parseFilterInput } from "../../utils"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { Province } from "../entities/province.entity"
import { CityInput } from "../inputs/city.input"

@Resolver(() => City)
export class CityResolver {
  @Query(() => [City!])
  cities(
    @Arg("filter", { nullable: true }) filter: CityInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<City[]> {
    return em.find(City, parseFilterInput<City>(filter))
  }

  @Query(() => City)
  city(
    @Arg("code") code: string,
    @Ctx() { em }: GraphQLContext
  ): Promise<City> {
    return em.findOneOrFail(City, { code })
  }

  @Query(() => Number)
  async cityCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(City, {})
    return total
  }

  @FieldResolver()
  province(@Root() city: City, @Ctx() { em }: GraphQLContext) {
    if (city.province.isInitialized()) {
      return city.province
    }
    return em.findOneOrFail(Province, { id: city.province.id })
  }
}
