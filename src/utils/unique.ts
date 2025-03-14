// @ts-nocheck

/**
 * This function takes an array of objects and a key
 * and returns a new array with unique items based on that key
 * @param array The array of objects to be filtered
 * @param key The key to be used for filtering
 * @returns A new array of unique objects
 */
export const uniqeArray = <T>(
  array: Array<Object>,
  key: string | number
): T => {
  return [
    ...new Map(
      array.map((item: { [key: string]: any }) => [item[key], item])
    ).values(),
  ] as T;
};
