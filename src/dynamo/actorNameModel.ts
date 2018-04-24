import { DynamoModel, DynamoModelOptions } from "./dynamoModel";
import { ActorName } from "@textactor/actor-domain";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG, formatCultureString } from "../helpers";

export class ActorNameModel extends DynamoModel<string, ActorName> {
    constructor(dynamodb?: any) {
        super(OPTIONS, dynamodb);
    }

    protected beforeCreating(data: ActorName): ActorName {
        data = super.beforeCreating(data);
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;

        (<any>data).culture = formatCultureString(data.lang, data.country);

        return data;
    }

    protected transformData(data: any): ActorName {
        if (data) {
            delete data.culture;
        }
        return super.transformData(data);
    }
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:ActorName',
    tableName: 'textactor_ActorNames_v0',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(16).max(40).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        culture: Joi.string().regex(/^[a-z]{2}_[a-z]{2}$/).required(),
        name: Joi.string().min(2).max(200).required(),
        actorId: Joi.string().max(40).required(),
        createdAt: Joi.number().integer().required(),
    },
    indexes: [
        {
            name: 'ActorIdIndex',
            type: 'global',
            hashKey: 'actorId',
            rangeKey: 'createdAt',
            projection: { NonKeyAttributes: ['name'], ProjectionType: 'INCLUDE' }
        }
    ]
}
