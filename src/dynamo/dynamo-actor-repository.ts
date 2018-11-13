import DynamoDB = require('aws-sdk/clients/dynamodb');

import { Actor, ActorValidator, ActorRepository } from '@textactor/actor-domain';
import { DynamoActorItem } from './dynamo-actor';
import { DynamoRepository } from './dynamo-repository';
import { RepositoryUpdateData, unixTime } from '@textactor/domain';

export class DynamoActorRepository extends DynamoRepository<Actor> implements ActorRepository {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super(new DynamoActorItem(client, tableSuffix), new ActorValidator());
    }

    protected beforeCreate(data: Actor): Actor {
        data.createdAt = data.createdAt || unixTime();
        data.updatedAt = data.updatedAt || data.createdAt;

        data = super.beforeCreate(data);

        return data;
    }

    protected beforeUpdate(data: RepositoryUpdateData<Actor>) {
        if (data.set) {
            data.set.updatedAt = data.set.updatedAt || Math.round(Date.now() / 1000);
        }

        data = super.beforeUpdate(data);

        return data;
    }
}
