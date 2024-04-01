export function transpose<T>(arr: T[][]) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}
