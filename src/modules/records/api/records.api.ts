import { AxiosRequestConfig } from "axios";
import { api } from "src/modules/common/api";
import { PaginateParams } from "src/modules/common/dto/paginate-params.dto";
import { CreateRecordDto } from "../dto/create-record.dto";
import { FindAllRecordsResultDto } from "../dto/find-all-records-result.dto";
import { UpdatePhotoDto } from "../dto/update-photo.dto";
import { UpdateRecordDto } from "../dto/update-record.dto";
import { PhotoDto } from "../dto/upload-photo.dto";
import { Record, RecordPhoto } from "../models/record.model";

export class FindAllRecordsParams extends PaginateParams {
  author?: string;
  userLat?: number;
  userLon?: number;
  radius?: number;
  search?: string;
}

const BASE_URL = "/records";

export abstract class RecordsApi {
  static async create(dto: CreateRecordDto) {
    return api.post<Record>(`${BASE_URL}`, dto);
  }
  static async findAll(params?: FindAllRecordsParams) {
    return api.get<FindAllRecordsResultDto>(`${BASE_URL}`, { params });
  }
  static async findOne(id: string) {
    return api.get<Record>(`${BASE_URL}/${id}`);
  }
  static async delete(id: string) {
    return api.delete<{
      record: Record;
      photos: { deleted: (void | RecordPhoto)[]; failed: string[] };
    }>(`${BASE_URL}/${id}`);
  }
  static async update(id: string, dto: UpdateRecordDto) {
    return api.patch<Record>(`${BASE_URL}/${id}`, dto);
  }
}
export class RecordPhotosApi {
  static async upload(
    recordId: Record["_id"],
    file: File | Blob,
    dto: PhotoDto,
    onUploadProgress?: AxiosRequestConfig["onUploadProgress"]
  ) {
    const formData = new FormData();
    formData.append("file", file);
    if (dto.comment) {
      formData.append("comment", dto.comment);
    }

    return api.post<RecordPhoto>(`/records/${recordId}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  static async delete(recordId: Record["_id"], photoId: RecordPhoto["_id"]) {
    return api.delete<RecordPhoto>(`${BASE_URL}/${recordId}/photos/${photoId}`);
  }

  static async update(
    recordId: Record["_id"],
    photoId: RecordPhoto["_id"],
    dto: UpdatePhotoDto
  ) {
    return api.patch<RecordPhoto>(
      `${BASE_URL}/${recordId}/photos/${photoId}`,
      dto
    );
  }
}
