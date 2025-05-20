export default function arrayMove<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const res = [...array];
  if (toIndex >= res.length) toIndex = res.length - 1;
  res.splice(toIndex, 0, res.splice(fromIndex, 1)[0]);
  return res;
}
