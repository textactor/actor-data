import { BaseEntity, BaseEntityId } from "@textactor/domain";

export function formatLocaleString(lang: string, country: string) {
  return `${lang.trim().toLowerCase()}_${country.trim().toLowerCase()}`;
}

export function sortEntitiesByIds<T extends BaseEntity>(
  ids: BaseEntityId[],
  entities: T[]
) {
  const list: T[] = [];
  for (const id of ids) {
    const entity = entities.find((item) => item.id === id);
    if (entity) {
      list.push(entity);
    }
  }

  return list;
}
