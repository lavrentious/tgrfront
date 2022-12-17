import { User } from "../../users/models/user.model";

export interface Address {
  region: string;
  city: string;
  street: string;
  house: string;
  displayName: string;
}

export enum SpotType {
  USEFUL,
  SIGHT,
}

export interface RecordPhoto {
  url: string;
  publicId: string;
  comment: string;
}

export interface Record {
  name: string;
  description: string;
  accessibility: string;
  address: Address;
  lat: number;
  lon: number;
  type: SpotType;
  author: User;
  photos: RecordPhoto[];
}
