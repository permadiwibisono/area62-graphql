import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { Province } from "../entities/province.entity"

@Resolver(() => City)
export class CityResolver {
  @Query(() => [City!])
  cities(@Ctx() { em }: GraphQLContext): Promise<City[]> {
    return em.find(City, {})
  }

  @Query(() => Number)
  async cityCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(City, {})
    return total
  }

  @FieldResolver()
  province(@Root() city: City, @Ctx() { em }: GraphQLContext) {
    return em.findOneOrFail(Province, { id: city.province.id })
  }
}
