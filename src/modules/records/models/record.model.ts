import { User, type IUser } from "../../users/models/user.model";

export interface Address {
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

export interface RecordPhoto {
  _id: string;
  url: string;
  publicId: string;
  comment?: string;
}

export interface IRecord {
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

// used for casl
export class Record implements IRecord {
  _id: string;
  name: string;
  description?: string | undefined;
  accessibility?: string | undefined;
  address: Address;
  lat: number;
  lon: number;
  type: SpotType;
  author: Partial<IUser> & { _id: string };
  photos: RecordPhoto[];
  createdAt: Date;
  updatedAt: Date;
  distance?: number | undefined;
  azimuth?: number | undefined;

  constructor(record: IRecord) {
    this.author = record.author;
    this.createdAt = new Date(record.createdAt);
    this.updatedAt = new Date(record.updatedAt);
    this._id = record._id;
    this.name = record.name;
    this.description = record.description;
    this.accessibility = record.accessibility;
    this.address = record.address;
    this.lat = record.lat;
    this.lon = record.lon;
    this.type = record.type;
    this.photos = record.photos;
    this.distance = record.distance;
    this.azimuth = record.azimuth;
  }
}
