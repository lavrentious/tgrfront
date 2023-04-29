import { Record } from "../models/record.model";

export class FindAllRecord extends Record {
  distance?: number;
  direction?: string;
  azimuth?: number;
}
