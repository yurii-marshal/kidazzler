export function diffBy(obj1: Object, obj2: Object, by: string[]): string[] {
  const diff: string[] = [];

  function coerceValue(value) {
    if (value === '' || value === undefined) return null;

    return value;
  }

  for (const prop of by) {
    if (coerceValue(obj1[prop]) !== coerceValue(obj2[prop])) diff.push(prop);
  }

  return diff.length ? diff : null;
}
