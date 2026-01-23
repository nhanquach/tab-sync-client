export function groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
  return array.reduce((map, item) => {
    const key = keyGetter(item);
    const collection = map[key];
    if (!collection) {
      map[key] = [item];
    } else {
      collection.push(item);
    }
    return map;
  }, {} as Record<string, T[]>);
}
