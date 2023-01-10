import { FindAllParams, RecordPhotosApi, RecordsApi } from "../api/records.api";
import { CreateRecordDto } from "../dto/create-record.dto";
import { UploadPhotoDto } from "../dto/upload-photo.dto";
import { Record } from "../models/record.model";

export abstract class RecordsService {
  static async findAll(params?: FindAllParams): Promise<Record[]> {
    return (await RecordsApi.findAll(params)).data.map((r) => new Record(r));
  }

  static async findOne(id: string): Promise<Record> {
    return new Record((await RecordsApi.findOne(id)).data);
  }
  static async create(
    dto: CreateRecordDto,
    photos: UploadPhotoDto[],
    onRecordCreate?: (record: Record) => void
  ) {
    return RecordsApi.create(dto).then(({ data: record }) => {
      if (onRecordCreate) onRecordCreate(record);
      return PhotosService.uploadPhotos(record._id, photos);
    });
  }
}

export abstract class PhotosService {
  static async uploadPhotos(recordId: Record["_id"], photos: UploadPhotoDto[]) {
    const res = {
      record: { _id: recordId } as Partial<Record>,
      failed: [] as typeof photos,
    };
    for (const photo of photos) {
      await RecordPhotosApi.upload(
        recordId,
        await fetch(photo.file.url).then((r) => r.blob()),
        photo.dto
      )
        .then(({ data }) => {
          res.record = data;
        })
        .catch(() => {
          res.failed.push(photo);
        });
    }
    if (photos.length > 0 && photos.length === res.failed.length)
      throw new Error("none of the photos uploaded");
    return res;
  }
}
