import { DynamoRepository } from "./dynamo-repository";
import { ActorName, IActorNameRepository } from "@textactor/actor-domain";

export class ActorNameRepository extends DynamoRepository<string, ActorName> implements IActorNameRepository {
    getNamesByActorId(actorId: string): Promise<ActorName[]> {
        return this.model.query({
            hashKey: actorId,
            sort: 'descending',
            index: 'ActorIdIndex',
            limit: 50,
        }).then(result => {
            if (!result) {
                return [];
            }
            return result.items || [];
        });
    }
    async addNames(names: ActorName[]): Promise<ActorName[]> {
        for (let name of names) {
            await this.model.createOrUpdate(name)
        }
        return names;
    }
}
