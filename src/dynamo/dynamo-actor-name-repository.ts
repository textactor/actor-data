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
            await (<DynamoActorNameItem>this.item).createOrUpdate(name)
        }
        return names;
    }
}
