import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { parseFilterInput } from "../../utils"
import { GraphQLContext } from "../../types"
import { DistrictOne } from "../entities/districtOne.entity"
import { DistrictTwo } from "../entities/districtTwo.entity"
import { DistrictTwoInput } from "../inputs/districtTwo.input"

@Resolver(() => DistrictTwo)
export class DistrictTwoResolver {
  @Query(() => [DistrictTwo!])
  districtTwos(
    @Arg("filter") filter: DistrictTwoInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictTwo[]> {
    return em.find(DistrictTwo, parseFilterInput<DistrictTwo>(filter))
  }

  @Query(() => DistrictTwo)
  districtTwo(
    @Arg("id") id: number,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictTwo> {
    return em.findOneOrFail(DistrictTwo, { id })
  }

  @Query(() => DistrictTwo)
  districtTwoByCode(
    @Arg("code") code: string,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictTwo> {
    return em.findOneOrFail(DistrictTwo, { code })
  }

  @Query(() => Number)
  async districtTwoCount(
    @Arg("filter", { nullable: true }) filter: DistrictTwoInput,
    @Ctx() { em }: GraphQLContext
  ) {
    const total = await em.count<DistrictTwo>(
      DistrictTwo,
      parseFilterInput<DistrictTwo>(filter)
    )
    return total
  }

  @FieldResolver()
  districtOne(@Root() districtTwo: DistrictTwo, @Ctx() { em }: GraphQLContext) {
    if (districtTwo.districtOne.isInitialized()) {
      return districtTwo.districtOne
    }
    return em.findOneOrFail(DistrictOne, { id: districtTwo.districtOne.id })
  }
}
