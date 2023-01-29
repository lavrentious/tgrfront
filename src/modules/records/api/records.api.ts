import { AxiosRequestConfig } from "axios";
import { api } from "src/modules/common/api";
import { CreateRecordDto } from "../dto/create-record.dto";
import { PhotoDto } from "../dto/upload-photo.dto";
import { Record, RecordPhoto } from "../models/record.model";

export class FindAllParams {
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
  static async findAll(params?: FindAllParams) {
    return api.get<Record[]>(`${BASE_URL}`, { params });
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

    return api.post<Record>(`/records/${recordId}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
}
