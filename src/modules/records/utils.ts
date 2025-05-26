import { Record, type Address, type IRecord } from "./models/record.model";

export function getDisplayAddress(address: Address): string {
  const { region, city, street, house } = address;
  return [street, house, city, region]
    .filter((e) => e && e.length > 0)
    .join(", ");
}

export function createRecord(record: IRecord): Record {
  /***
   * used for casl to detect subject type
   *
   */
  return new Record(record);
}
