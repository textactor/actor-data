import { DynamoRepository } from "./dynamoRepository";
import { ActorName, IActorNameRepository } from "@textactor/actor-domain";
import { seriesPromise } from "@textactor/domain";

export class ActorNameRepository extends DynamoRepository<string, ActorName> implements IActorNameRepository {
    getNamesByActorId(actorId: string): Promise<ActorName[]> {
        return this.model.query({
            hashKey: actorId,
            sort: 'descending',
            index: 'ActorIdIndex',
            limit: 50,
        }).then(result => {
            if (!result) {
                return null;
            }
            return result.items;
        });
    }
    addNames(names: ActorName[]): Promise<ActorName[]> {
        return seriesPromise(names, name => this.model.createOrUpdate(name)).then(() => names);
    }
}
