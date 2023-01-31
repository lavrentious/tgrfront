import { User } from "../../users/models/user.model";

export class Address {
  region?: string;
  city?: string;
  street?: string;
  house?: string;
  displayName?: string;
}

export enum SpotType {
  USEFUL = "USEFUL",
  SIGHT = "SIGHT",
  MISC = "MISC",
}

export class RecordPhoto {
  _id: string;
  url: string;
  publicId: string;
  comment: string;
}

export interface Record {
  _id: string;
  name: string;
  description?: string;
  accessibility?: string;
  address: Address;
  lat: number;
  lon: number;
  type: SpotType;
  author: Partial<User> & { _id: string };
  photos: RecordPhoto[];
  createdAt: Date;
  updatedAt: Date;
  distance?: number;
  azimuth?: number;
}
export class Record implements Record {
  constructor(record: Record) {
    Object.assign(this, record);
    this.author =
      typeof record.author === "string"
        ? { _id: record.author }
        : record.author;
    this.createdAt = new Date(record.createdAt);
    this.updatedAt = new Date(record.updatedAt);
  }
}
