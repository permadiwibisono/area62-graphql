import { Ctx, Query, Resolver } from "type-graphql"
import { GraphQLContext } from "../../types"
import { PostalCode } from "../entities/postalCode.entity"

@Resolver(() => PostalCode)
export class PostalCodeResolver {
  @Query(() => [PostalCode!])
  postalCodes(@Ctx() { em }: GraphQLContext): Promise<PostalCode[]> {
    return em.find(PostalCode, {})
  }

  @Query(() => Number)
  async postalCodeCount(@Ctx() { em }: GraphQLContext) {
    const total = await em.count(PostalCode, {})
    return total
  }
}
