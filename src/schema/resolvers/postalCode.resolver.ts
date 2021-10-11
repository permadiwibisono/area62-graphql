import { Arg, Ctx, Query, Resolver } from "type-graphql"
import { parseFilterInput } from "../../utils"
import { GraphQLContext } from "../../types"
import { PostalCode } from "../entities/postalCode.entity"
import { PostalInput } from "../inputs/postal.input"

@Resolver(() => PostalCode)
export class PostalCodeResolver {
  @Query(() => [PostalCode!])
  postalCodes(
    @Arg("filter", { nullable: true }) filter: PostalInput,
    @Ctx() { em }: GraphQLContext
  ): Promise<PostalCode[]> {
    return em.find(PostalCode, parseFilterInput<PostalCode>(filter))
  }

  @Query(() => PostalCode)
  postalCode(
    @Arg("id") id: number,
    @Ctx() { em }: GraphQLContext
  ): Promise<PostalCode> {
    return em.findOneOrFail(PostalCode, { id })
  }

  @Query(() => PostalCode)
  postalCodeByCode(
    @Arg("code") code: string,
    @Ctx() { em }: GraphQLContext
  ): Promise<PostalCode> {
    return em.findOneOrFail(PostalCode, { code })
  }

  @Query(() => Number)
  async postalCodeCount(
    @Arg("filter", { nullable: true }) filter: PostalInput,
    @Ctx() { em }: GraphQLContext
  ) {
    const total = await em.count<PostalCode>(
      PostalCode,
      parseFilterInput<PostalCode>(filter)
    )
    return total
  }
}
