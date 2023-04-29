import { PaginateResultMeta } from "src/modules/common/dto/paginate-result-meta.dto";
import { FindAllRecord } from "./find-all-record.dto";

export class FindAllResultDto extends PaginateResultMeta {
  docs: FindAllRecord[];
}
