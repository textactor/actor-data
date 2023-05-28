import DynamoDB = require("aws-sdk/clients/dynamodb");
import { DynamoActorRepository } from "./dynamo/dynamo-actor-repository";
import { ActorRepository, ActorNameRepository } from "@textactor/actor-domain";
import { DynamoActorNameRepository } from "./dynamo/dynamo-actor-name-repository";

export class ActorRepositoryBuilder {
  static build(
    client: DynamoDB.DocumentClient,
    tableSuffix: string = "v1"
  ): ActorRepository {
    return new DynamoActorRepository(client, tableSuffix);
  }
}

export class ActorNameRepositoryBuilder {
  static build(
    client: DynamoDB.DocumentClient,
    tableSuffix: string = "v1"
  ): ActorNameRepository {
    return new DynamoActorNameRepository(client, tableSuffix);
  }
}
