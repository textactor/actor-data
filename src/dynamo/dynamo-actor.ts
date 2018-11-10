import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    DynamoItem,
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

        (<any>data).locale = formatLocaleString(data.lang, data.country);

        return data;
    }

    protected toExternItem(data: Dictionary<any>) {
        delete data.locale;
        return super.toExternItem(data);
    }
}
