import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { DistrictOne } from "../entities/districtOne.entity"

@Resolver(() => DistrictOne)
export class DistrictOneResolver {
  @Query(() => [DistrictOne!])
  districtOnes(@Ctx() { em }: GraphQLContext): Promise<DistrictOne[]> {
    return em.find(DistrictOne, {})
  }

  @Query(() => Number)
  async districtOneCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(DistrictOne, {})
    return total
  }

  @FieldResolver()
  city(@Root() districtOne: DistrictOne, @Ctx() { em }: GraphQLContext) {
    return em.findOneOrFail(City, { id: districtOne.city.id })
  }
}
