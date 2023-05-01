import { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import { FindAllRecord } from "./find-all-record.dto";

export type FindAllResultDto = PaginateResult<FindAllRecord>;
