export function difference(arr1: unknown[], arr2: unknown[]) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return Array.isArray(arr1) ? arr1 : Array.isArray(arr2) ? arr2 : [];
  }
  const set = new Set(arr2);
  const difference = new Set(arr1.filter((elem) => !set.has(elem)));
  return Array.from(difference);
}

export function symmetricDifference(arr1: unknown[], arr2: unknown[]) {
  return difference(arr1, arr2).concat(difference(arr2, arr1));
}
