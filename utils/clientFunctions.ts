export function getEnumKeysAndValues<T>(
  enumObj: T
): { key: string; value: any }[] {
  return Object.keys(enumObj as unknown as any)
    .filter((key) => isNaN(Number(key))) // Filter out numeric keys from reverse mappings
    .map((key) => ({ key, value: (enumObj as any)[key] }));
}
