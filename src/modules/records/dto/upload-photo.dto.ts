import { AxiosRequestConfig } from "axios";
import { IFile } from "src/store/createSpot.reducer";

export interface PhotoDto {
  comment?: string;
}

export interface UploadPhotoDto extends IFile {
  onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
}
