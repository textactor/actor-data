import { DynamoModel, DynamoModelOptions } from "./dynamoModel";
import { Actor } from "@textactor/actor-domain";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG, WIKI_DATA_ID_REG, formatCultureString } from "../helpers";
import { RepUpdateData } from "@textactor/domain";

export class ActorModel extends DynamoModel<string, Actor> {
    constructor(dynamodb?: any) {
        super(OPTIONS, dynamodb);
    }

    protected beforeCreating(data: Actor): Actor {
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;
        data.updatedAt = data.createdAt || ts;

        (<any>data).culture = formatCultureString(data.lang, data.country);

        return data;
    }

    protected beforeUpdating(data: RepUpdateData<Actor>): RepUpdateData<Actor> {
        data = super.beforeUpdating(data);
        data.item.updatedAt = data.item.updatedAt || Math.round(Date.now() / 1000);

        return data;
    }

    protected transformData(data: any): Actor {
        if (data) {
            delete data.culture;
        }
        return super.transformData(data);
    }
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:Actor',
    tableName: 'textactor_Actors_v0',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(6).max(16).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        culture: Joi.string().regex(/^[a-z]{2}_[a-z]{2}$/).required(),
        name: Joi.string().min(2).max(200).required(),
        abbr: Joi.string().min(1).max(50),
        wikiDataId: Joi.string().regex(WIKI_DATA_ID_REG),
        type: Joi.valid('EVENT', 'ORG', 'PERSON', 'PLACE', 'PRODUCT').required(),
        description: Joi.string().max(200),
        createdAt: Joi.number().integer().required(),
        updatedAt: Joi.number().integer().required(),
    }
}
