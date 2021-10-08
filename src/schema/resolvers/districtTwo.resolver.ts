import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { GraphQLContext } from "../../types"
import { DistrictOne } from "../entities/districtOne.entity"
import { DistrictTwo } from "../entities/districtTwo.entity"

@Resolver(() => DistrictTwo)
export class DistrictTwoResolver {
  @Query(() => [DistrictTwo!])
  districtTwos(@Ctx() { em }: GraphQLContext): Promise<DistrictTwo[]> {
    return em.find(DistrictTwo, {})
  }

  @Query(() => Number)
  async districtTwoCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(DistrictTwo, {})
    return total
  }

  @FieldResolver()
  districtOne(@Root() districtTwo: DistrictTwo, @Ctx() { em }: GraphQLContext) {
    return em.findOneOrFail(DistrictOne, { id: districtTwo.districtOne.id })
  }
}
