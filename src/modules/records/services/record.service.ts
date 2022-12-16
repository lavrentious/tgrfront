import { api } from "src/modules/common/api";
import { Record } from "src/modules/records/models/record.model";

const BASE_PATH = "/records";

export function getAll() {
  return api.get<Record[]>(BASE_PATH);
}
