import { api } from "src/modules/common/api";
import { Record } from "../models/record.model";

export class FindAllParams {
  userLat?: number;
  userLon?: number;
  radius?: number;
  search?: string;
}

const BASE_URL = "/records";

export abstract class RecordsApi {
  static async findAll(params?: FindAllParams) {
    return api.get<Record[]>(`${BASE_URL}`, { params });
  }
  static async findOne(id: string) {
    return api.get<Record>(`${BASE_URL}/${id}`);
  }
}
