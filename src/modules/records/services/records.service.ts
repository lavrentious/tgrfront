import { FindAllParams, RecordsApi } from "../api/records.api";
import { Record } from "../models/record.model";

export abstract class RecordsService {
  static async findAll(params?: FindAllParams): Promise<Record[]> {
    return (await RecordsApi.findAll(params)).data.map((r) => new Record(r));
  }

  static async findOne(id: string): Promise<Record> {
    return new Record((await RecordsApi.findOne(id)).data);
  }
}
