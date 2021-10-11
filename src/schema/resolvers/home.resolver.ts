import { Query, Resolver } from "type-graphql"

@Resolver()
export class HomeResolver {
  @Query(() => String)
  hello() {
    return "Hello World"
  }
}
