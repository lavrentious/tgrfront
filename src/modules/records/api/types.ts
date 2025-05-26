import type { PaginateParams } from "src/modules/common/dto/paginate-params.dto";

export interface FindAllRecordsParams extends PaginateParams {
  author?: string;
  userLat?: number;
  userLon?: number;
  radius?: number;
  search?: string;
}
