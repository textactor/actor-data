import { DynamoModel, DynamoModelOptions, ModelOptions, buildDynamoOptions } from "./dynamo-model";
import { Actor } from "@textactor/actor-domain";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG, WIKI_DATA_ID_REG, formatLocaleString } from "../helpers";
import { RepUpdateData } from "@textactor/domain";

export class ActorModel extends DynamoModel<string, Actor> {
    constructor(options?: ModelOptions) {
        options = options || {};

        super(buildDynamoOptions(OPTIONS, options), options.dynamodb);
    }

    protected beforeCreating(data: Actor): Actor {
        data = super.beforeCreating(data);
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;
        data.updatedAt = data.createdAt || ts;

        (<any>data).locale = formatLocaleString(data.lang, data.country);

        return data;
    }

    protected beforeUpdating(data: RepUpdateData<string, Actor>): RepUpdateData<string, Actor> {
        data = super.beforeUpdating(data);
        if (data.set) {
            delete data.set.createdAt;
            delete data.set.lang;
            delete data.set.country;
            data.set.updatedAt = data.set.updatedAt || Math.round(Date.now() / 1000);
        }

        return data;
    }

    protected transformData(data: any): Actor {
        if (data) {
            delete data.locale;
        }
        return super.transformData(data);
    }
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:Actor',
    tableName: 'textactor_actors_v1',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(6).max(16).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        locale: Joi.string().regex(/^[a-z]{2}_[a-z]{2}$/).required(),
        name: Joi.string().min(2).max(200).required(),
        commonName: Joi.string().min(2).max(200),
        englishName: Joi.string().min(2).max(200),
        countryCodes: Joi.array().items(Joi.string().regex(COUNTRY_REG).required()).unique().max(6),
        abbr: Joi.string().min(1).max(50),
        wikiDataId: Joi.string().regex(WIKI_DATA_ID_REG).required(),
        wikiPageTitle: Joi.string().min(2).max(200),
        type: Joi.valid('EVENT', 'ORG', 'PERSON', 'PLACE', 'PRODUCT', 'WORK'),
        description: Joi.string().max(200),
        wikiCountLinks: Joi.number().integer().min(1).max(500).required(),
        createdAt: Joi.number().integer().required(),
        updatedAt: Joi.number().integer().required(),
    },
    indexes: [
        {
            name: 'LocaleCreatedIndex',
            type: 'global',
            hashKey: 'locale',
            rangeKey: 'createdAt',
            projection: { ProjectionType: 'KEYS_ONLY' }
        }
    ]
}
