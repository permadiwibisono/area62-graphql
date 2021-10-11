import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { parseFilterInput } from "../../utils"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { Country } from "../entities/country.entity"
import { Province } from "../entities/province.entity"
import { ProvinceInput } from "../inputs/province.input"

@Resolver(() => Province)
export class ProvinceResolver {
  @Query(() => [Province!])
  provinces(
    @Arg("filter", { nullable: true }) filter: ProvinceInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<Province[]> {
    return em.find(Province, parseFilterInput<Province>(filter))
  }

  @Query(() => Province)
  province(
    @Arg("id") id: number,
    @Ctx() { em }: GraphQLContext
  ): Promise<Province> {
    return em.findOneOrFail(Province, { id })
  }

  @Query(() => Province)
  provinceByCode(
    @Arg("code") code: string,
    @Ctx() { em }: GraphQLContext
  ): Promise<Province> {
    return em.findOneOrFail(Province, { code })
  }

  @Query(() => Number)
  async provinceCount(
    @Arg("filter", { nullable: true }) filter: ProvinceInput,
    @Ctx() { em }: GraphQLContext
  ) {
    const total = await em.count(Province, parseFilterInput<Province>(filter))
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
