import DynamoDB = require("aws-sdk/clients/dynamodb");
import { DynamoItem } from "dynamo-item";

import { ActorName } from "@textactor/actor-domain";
import { formatLocaleString } from "../helpers";
import { Dictionary } from "@textactor/domain";

export class DynamoActorNameItem extends DynamoItem<{ id: string }, ActorName> {
  constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
    super(
      {
        hashKey: {
          name: "id",
          type: "S"
        },
        name: "actors_names",
        tableName: `textactor_actor_names_${tableSuffix}`,
        indexes: [
          {
            name: "ActorIdIndex",
            type: "GLOBAL",
            hashKey: { name: "actorId", type: "S" },
            rangeKey: { name: "createdAt", type: "N" },
            projection: { include: ["name", "type"], type: "INCLUDE" }
          }
        ]
      },
      client
    );
  }

  protected override beforeCreate(data: ActorName): ActorName {
    data = super.beforeCreate(data);

    const locale = ((<any>data).locale = formatLocaleString(
      data.lang,
      data.country
    ));
    (<any>data).countWordsKey = `${locale}_${data.countWords}`;

    return data;
  }

  protected override toExternItem(data: Dictionary<any>) {
    delete data.locale;
    delete data.countWordsKey;

    return super.toExternItem(data);
  }
}
