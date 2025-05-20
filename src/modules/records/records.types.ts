import type { PhotoDto } from "./dto/upload-photo.dto";
import type { RecordPhoto } from "./models/record.model";

export enum FileStatus {
  PENDING,
  SUCCESS,
  FAILED,
}
export interface IFile {
  file: { name: string; url: string; size: number };
  dto: PhotoDto;
  meta?: {
    fromDB?: RecordPhoto;
    progress?: number;
    status?: FileStatus;
  };
}
