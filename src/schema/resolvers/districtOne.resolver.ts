import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql"
import { parseFilterInput } from "../../utils"
import { GraphQLContext } from "../../types"
import { City } from "../entities/city.entity"
import { DistrictOne } from "../entities/districtOne.entity"
import { DistrictOneInput } from "../inputs/districtOne.input"
import { DistrictTwo } from "../entities/districtTwo.entity"

@Resolver(() => DistrictOne)
export class DistrictOneResolver {
  @Query(() => [DistrictOne!])
  districtOnes(
    @Arg("filter") filter: DistrictOneInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictOne[]> {
    return em.find(DistrictOne, parseFilterInput<DistrictOne>(filter))
  }

  @Query(() => DistrictOne)
  districtOne(
    @Arg("id") id: number,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictOne> {
    return em.findOneOrFail(DistrictOne, { id })
  }

  @Query(() => DistrictOne)
  districtOneByCode(
    @Arg("code") code: string,
    @Ctx() { em }: GraphQLContext
  ): Promise<DistrictOne> {
    return em.findOneOrFail(DistrictOne, { code })
  }

  @Query(() => Number)
  async districtOneCount(
    @Arg("filter", { nullable: true }) filter: DistrictOneInput,
    @Ctx() { em }: GraphQLContext
  ) {
    const total = await em.count(
      DistrictOne,
      parseFilterInput<DistrictOne>(filter)
    )
    return total
  }

  @FieldResolver()
  city(@Root() districtOne: DistrictOne, @Ctx() { em }: GraphQLContext) {
    if (districtOne.city.isInitialized()) {
      return districtOne.city
    }
    return em.findOneOrFail(City, { id: districtOne.city.id })
  }

  @FieldResolver()
  districtTwos(
    @Root() districtOne: DistrictOne,
    @Ctx() { em }: GraphQLContext
  ) {
    if (districtOne.districtTwos.isInitialized()) {
      return districtOne.districtTwos
    }
    return em.find(DistrictTwo, { districtOne: { id: districtOne.id } })
  }
}
