export type CollectionModel<K extends string | number, T> = {
  order: K[];
  entities: Record<K, T>;
};

export const getInitialCollectionModel = <K extends string | number, T>(): CollectionModel<K, T> => ({
  order: [],
  entities: {} as Record<K, T>,
});

export const normalizeCollection = <K extends string | number, T>(
  elements: T[],
  getKeyForElement: (element: T) => K,
): CollectionModel<K, T> => {
  const collection: CollectionModel<K, T> = getInitialCollectionModel();

  elements.forEach((element) => {
    const id = getKeyForElement(element);
    collection.order.push(id);
    collection.entities[id] = element;
  });

  return collection;
};

export const linearizeCollection = <K extends string | number, T>(elements: CollectionModel<K, T>): T[] =>
  elements.order.map((element) => elements.entities[element]);
