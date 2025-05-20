import { type Address, SpotType } from "../models/record.model";

export interface CreateRecordDto {
  name: string;
  description?: string;
  accessibility?: string;
  lat: number;
  lon: number;
  type: SpotType;
  address?: Address;
}
