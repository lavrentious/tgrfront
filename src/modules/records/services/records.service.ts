import store from "src/store";
import { updateFile } from "src/store/createSpot.reducer";
import {
  FindAllRecordsParams,
  RecordPhotosApi,
  RecordsApi,
} from "../api/records.api";
import { CreateRecordDto } from "../dto/create-record.dto";
import { FindAllRecordsResultDto } from "../dto/find-all-records-result.dto";
import { UpdateRecordDto } from "../dto/update-record.dto";
import { UploadPhotoDto } from "../dto/upload-photo.dto";
import { Record, RecordPhoto } from "../models/record.model";
import { FileStatus } from "../records.types";
import { AxiosError } from "axios";

export abstract class RecordsService {
  static async findAll(
    params?: FindAllRecordsParams
  ): Promise<FindAllRecordsResultDto> {
    const res = (await RecordsApi.findAll(params)).data;
    return { ...res, docs: res.docs.map((d) => new Record(d)) };
  }

  static async findOne(id: string): Promise<Record> {
    return new Record((await RecordsApi.findOne(id)).data);
  }
  static async create(
    dto: CreateRecordDto,
    photos: UploadPhotoDto[],
    onRecordCreate?: (record: Record) => void
  ) {
    const { data: record } = await RecordsApi.create(dto);
    if (onRecordCreate) onRecordCreate(record);
    const photosResult = await PhotosService.uploadPhotos(record._id, photos);
    return { record, photos: photosResult };
  }

  static async delete(id: string) {
    return RecordsApi.delete(id);
  }

  static async update(
    id: string,
    dto: UpdateRecordDto,
    photos: UploadPhotoDto[],
    initPhotos: RecordPhoto[]
  ) {
    const addedPhotos = photos.filter(
      (p) => initPhotos.findIndex((ip) => ip.url === p.file.url) === -1
    );
    const changedPhotos = photos
      .filter((p) => {
        const ip = initPhotos.find((ip) => p.file.url === ip.url);
        return ip && ip.comment !== p.dto.comment;
      })
      .map((p) => {
        const ip = initPhotos.find((ip) => ip.url === p.file.url);
        return ip && { id: ip._id, dto: p.dto };
      });
    const idsByUrls = new Map<string, string>();
    for (const photo of photos) {
      if (photo.meta?.fromDB) {
        idsByUrls.set(photo.file.url, photo.meta?.fromDB?._id);
      }
    }
    await Promise.all(
      addedPhotos.map(async (p) => {
        const fromDB = await PhotosService.uploadOne(id, p);
        idsByUrls.set(p.file.url, fromDB._id);
      })
    );
    const photosIds: string[] = [];
    for (const photo of photos) {
      const id = idsByUrls.get(photo.file.url);
      if (id) {
        photosIds.push(id);
      }
    }
    await RecordsApi.update(id, {
      ...dto,
      photos: photosIds,
    });
    await Promise.all(
      changedPhotos.map((p) => p && RecordPhotosApi.update(id, p.id, p.dto))
    );
  }
}

export abstract class PhotosService {
  static async uploadOne(recordId: Record["_id"], photo: UploadPhotoDto) {
    store.dispatch(
      updateFile({
        url: photo.file.url,
        value: {
          ...photo,
          meta: { progress: photo.file.size, status: FileStatus.PENDING },
        },
      })
    );
    return RecordPhotosApi.upload(
      recordId,
      await fetch(photo.file.url).then((r) => r.blob()),
      photo.dto,
      (e) => {
        store.dispatch(
          updateFile({
            url: photo.file.url,
            value: {
              ...photo,
              meta: { ...photo.meta, progress: e.total ?? 0 },
            },
          })
        );
      }
    )
      .then(({ data }) => {
        store.dispatch(
          updateFile({
            url: photo.file.url,
            value: {
              ...photo,
              meta: {
                ...photo.meta,
                fromDB: data,
                progress: photo.file.size,
                status: FileStatus.SUCCESS,
              },
            },
          })
        );
        return data;
      })
      .catch((e) => {
        store.dispatch(
          updateFile({
            url: photo.file.url,
            value: {
              ...photo,
              meta: { ...photo.meta, progress: 0, status: FileStatus.FAILED },
            },
          })
        );
        throw e;
      });
  }
  static async uploadPhotos(recordId: Record["_id"], photos: UploadPhotoDto[]) {
    const res = {
      uploaded: [] as RecordPhoto[],
      failed: [] as { i: number; url: string; error: string }[],
    };
    const idsByUrls = new Map<string, string>();
    await Promise.all(
      photos.map(async (photo, i) => {
        try {
          const fromDB = await PhotosService.uploadOne(recordId, photo);
          idsByUrls.set(photo.file.url, fromDB._id);
          res.uploaded.push(fromDB);
        } catch (e) {
          if (e instanceof AxiosError) {
            res.failed.push({
              i,
              url: photo.file.url,
              error: e.response?.data?.message,
            });
          }
        }
      })
    );
    const photosIds: string[] = [];
    for (const photo of photos) {
      const id = idsByUrls.get(photo.file.url);
      if (id) {
        photosIds.push(id);
      }
    }
    if (photosIds.length) {
      await RecordsApi.update(recordId, { photos: photosIds });
    }
    return res;
  }
}
