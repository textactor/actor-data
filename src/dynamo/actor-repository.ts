import { DynamoRepository } from "./dynamo-repository";
import { Actor, IActorRepository } from "@textactor/actor-domain";

export class ActorRepository extends DynamoRepository<string, Actor> implements IActorRepository {

}
