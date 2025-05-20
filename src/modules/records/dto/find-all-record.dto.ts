import type { Record } from "../models/record.model";

export interface FindAllRecord extends Record {
  distance?: number;
  direction?: string;
  azimuth?: number;
}
