import { Record, RecordPhoto } from "../models/record.model";

export type UpdateRecordDto =
  | (Partial<Record> & { autoAddress?: boolean })
  | {
      photos: RecordPhoto["_id"][];
    };
