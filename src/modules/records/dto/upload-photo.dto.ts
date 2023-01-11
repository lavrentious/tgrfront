import { IFile } from "src/store/createSpot.reducer";

export interface PhotoDto {
  comment?: string;
}

export type UploadPhotoDto = IFile;
