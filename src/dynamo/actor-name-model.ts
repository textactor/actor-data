import { DynamoModel, DynamoModelOptions, ModelOptions, buildDynamoOptions } from "./dynamo-model";
import { ActorName } from "@textactor/actor-domain";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG, formatLocaleString } from "../helpers";

export class ActorNameModel extends DynamoModel<string, ActorName> {
    constructor(options?: ModelOptions) {
        options = options || {};

        super(buildDynamoOptions(OPTIONS, options), options.dynamodb);
    }

    protected beforeCreating(data: ActorName): ActorName {
        data = super.beforeCreating(data);
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;

        const locale = (<any>data).locale = formatLocaleString(data.lang, data.country);
        (<any>data).countWordsKey = `${locale}_${data.countWords}`;

        return data;
    }

    protected transformData(data: any): ActorName {
        if (data) {
            delete data.locale;
            delete data.countWordsKey;
        }
        return super.transformData(data);
    }
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:ActorName',
    tableName: 'textactor_actor_names_v1',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(16).max(40).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        locale: Joi.string().regex(/^[a-z]{2}_[a-z]{2}$/).required(),
        name: Joi.string().min(2).max(200).required(),
        actorId: Joi.string().max(40).required(),
        type: Joi.valid('WIKI', 'SAME').required(),
        createdAt: Joi.number().integer().required(),
        countWords: Joi.number().integer().min(1).max(100).required(),
        countWordsKey: Joi.string().regex(/^[a-z]{2}_[a-z]{2}_\d+$/).required(),
    },
    indexes: [
        {
            name: 'ActorIdIndex',
            type: 'global',
            hashKey: 'actorId',
            rangeKey: 'createdAt',
            projection: { NonKeyAttributes: ['name', 'type'], ProjectionType: 'INCLUDE' }
        }
    ]
}
