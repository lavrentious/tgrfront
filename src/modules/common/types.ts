export interface NormalizedObjects<T> {
  byId: { [id: string]: T };
  allIds: string[];
}
