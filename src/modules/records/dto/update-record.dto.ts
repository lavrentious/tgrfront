import { Record, RecordPhoto } from "../models/record.model";

export type UpdateRecordDto = Partial<Record> | {
  photos: RecordPhoto["_id"][];
};
