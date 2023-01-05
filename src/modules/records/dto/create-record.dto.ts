import { Address, SpotType } from "../models/record.model";

export class CreateRecordDto {
  name: string;
  description?: string;
  accessibility?: string;
  lat: number;
  lon: number;
  type: SpotType;
  address?: Address;
}
