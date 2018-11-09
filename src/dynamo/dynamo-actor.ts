import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    DynamoItem, ItemUpdateData,
} from 'dynamo-item';

import { Actor } from '@textactor/actor-domain';
import { formatLocaleString } from '../helpers';
import { Dictionary } from '@textactor/domain';

export class DynamoActorItem extends DynamoItem<{ id: string }, Actor> {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super({
            hashKey: {
                name: 'id',
                type: 'S'
            },
            name: 'actors',
            tableName: `textactor_actors_${tableSuffix}`,
            indexes: [
                {
                    name: 'LocaleCreatedIndex',
                    type: 'GLOBAL',
                    hashKey: { name: 'locale', type: 'S' },
                    rangeKey: { name: 'createdAt', type: 'N' },
                    projection: { type: 'KEYS_ONLY' }
                }
            ]
        }, client);
    }

    protected beforeCreate(data: Actor): Actor {
        data = super.beforeCreate(data);

        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;
        data.updatedAt = data.createdAt || ts;

        (<any>data).locale = formatLocaleString(data.lang, data.country);

        return data;
    }

    protected beforeUpdate(data: ItemUpdateData<Actor>) {
        data = super.beforeUpdate(data);
        if (data.set) {
            data.set.updatedAt = data.set.updatedAt || Math.round(Date.now() / 1000);
        }

        return data;
    }

    protected toExternItem(data: Dictionary<any>) {
        delete data.locale;
        return super.toExternItem(data);
    }
}
