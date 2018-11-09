import DynamoDB = require('aws-sdk/clients/dynamodb');

import { Actor, ActorValidator, ActorRepository } from '@textactor/actor-domain';
import { DynamoActorItem } from './dynamo-actor';
import { DynamoRepository } from './dynamo-repository';

export class DynamoActorRepository extends DynamoRepository<Actor> implements ActorRepository {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super(new DynamoActorItem(client, tableSuffix), new ActorValidator());
    }
}
