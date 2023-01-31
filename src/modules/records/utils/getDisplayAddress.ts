import { Address } from "../models/record.model";

export function getDisplayAddress(address: Address): string {
  const { region, city, street, house } = address;
  return [region, city, street, house]
    .filter((e) => e && e.length > 0)
    .join(", ");
}
