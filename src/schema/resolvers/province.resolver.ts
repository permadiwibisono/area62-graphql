import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { Country } from "../entities/country.entity"
import { Province } from "../entities/province.entity"

@Resolver(() => Province)
export class ProvinceResolver {
  @Query(() => [Province!])
  provinces(@Ctx() { em }: GraphQLContext): Promise<Province[]> {
    return em.find(Province, {})
  }

  @Query(() => Number)
  async provinceCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(Province, {})
    return total
  }

  @FieldResolver()
  country(@Root() province: Province, @Ctx() { em }: GraphQLContext) {
    if (province.country.isInitialized()) {
      return province.country
    }
    return em.findOneOrFail(Country, { id: province.country.id })
  }

  @FieldResolver()
  cities(@Root() province: Province, @Ctx() { em }: GraphQLContext) {
    if (province.cities.isInitialized()) {
      return province.cities
    }
    return em.find(City, { province: { id: province.id } })
  }
}
