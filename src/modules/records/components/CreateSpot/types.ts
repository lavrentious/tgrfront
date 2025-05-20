import { type Address, SpotType } from "../../models/record.model";

export const TYPE_PLACEHOLDER = "TYPE_PLACEHOLDER";
export interface CreateSpotValues {
  name: string;
  description?: string;
  accessibility?: string;
  type: SpotType | typeof TYPE_PLACEHOLDER;
  autoAddress: boolean;
  address: Address;
}
