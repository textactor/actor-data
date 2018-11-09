import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    DynamoItem, ItemUpdateData,
} from 'dynamo-item';

import { ActorName, ACTOR_NAME_UPDATE_FIELDS } from '@textactor/actor-domain';
import { formatLocaleString } from '../helpers';
import { Dictionary } from '@textactor/domain';

export class DynamoActorNameItem extends DynamoItem<{ id: string }, ActorName> {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super({
            hashKey: {
                name: 'id',
                type: 'S'
            },
            name: 'actors_names',
            tableName: `textactor_actors_names_${tableSuffix}`,
            indexes: [
                {
                    name: 'ActorIdIndex',
                    type: 'GLOBAL',
                    hashKey: { name: 'actorId', type: 'S' },
                    rangeKey: { name: 'createdAt', type: 'N' },
                    projection: { include: ['name', 'type'], type: 'INCLUDE' },
                }
            ]
        }, client);
    }

    protected beforeCreate(data: ActorName): ActorName {
        data = super.beforeCreate(data);

        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;

        const locale = (<any>data).locale = formatLocaleString(data.lang, data.country);
        (<any>data).countWordsKey = `${locale}_${data.countWords}`;

        return data;
    }

    protected beforeUpdate(data: ItemUpdateData<ActorName>) {
        if (data.set) {
            for (const field of Object.keys(data.set)) {
                if (!ACTOR_NAME_UPDATE_FIELDS.includes(field)) {
                    delete (<any>data.set)[field];
                }
            }
        }
        return data;
    }

    protected toExternItem(data: Dictionary<any>) {
        delete data.locale;
        delete data.countWordsKey;

        return super.toExternItem(data);
    }

    async createOrUpdate(item: ActorName) {
        try {
            return this.create(item);
        }
        catch (error) {
            if (error.code === 'ConditionalCheckFailedException') {
                return this.update({ key: { id: item.id }, set: item });
            }
            return Promise.reject(error);
        }
    }
}
