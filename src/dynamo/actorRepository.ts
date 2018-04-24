import { DynamoRepository } from "./dynamoRepository";
import { Actor, IActorRepository } from "@textactor/actor-domain";

export class ActorRepository extends DynamoRepository<string, Actor> implements IActorRepository {

}
