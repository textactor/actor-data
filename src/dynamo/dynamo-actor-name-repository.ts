import DynamoDB = require('aws-sdk/clients/dynamodb');

import { ActorName, ActorNameValidator, ActorNameRepository } from '@textactor/actor-domain';
import { DynamoActorNameItem } from './dynamo-actor-name';
import { DynamoRepository } from './dynamo-repository';

export class DynamoActorNameRepository extends DynamoRepository<ActorName> implements ActorNameRepository {

    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super(new DynamoActorNameItem(client, tableSuffix), new ActorNameValidator());
    }

    async getNamesByActorId(actorId: string): Promise<ActorName[]> {
        const result = await this.item.query({
            hashKey: actorId,
            order: 'DESC',
            index: 'ActorIdIndex',
            limit: 50,
        });
        if (!result) {
            return [];
        }
        return result.items || [];
    }

    async addNames(names: ActorName[]): Promise<ActorName[]> {
        for (let name of names) {
            await this.put(name)
        }
        return names;
    }

    protected beforeCreate(data: ActorName): ActorName {
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;

        data = super.beforeCreate(data);

        return data;
    }
}
