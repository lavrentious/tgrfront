import { api } from "src/api/api";
import type { CreateRecordDto } from "../dto/create-record.dto";
import type { FindAllRecordsResultDto } from "../dto/find-all-records-result.dto";
import type { UpdatePhotoDto } from "../dto/update-photo.dto";
import type { UpdateRecordDto } from "../dto/update-record.dto";
import type { PhotoDto } from "../dto/upload-photo.dto";
import { Record, type IRecord, type RecordPhoto } from "../models/record.model";
import type { FindAllRecordsParams } from "./types";

const BASE_URL = "/records";

export const recordsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query<
      FindAllRecordsResultDto,
      FindAllRecordsParams | void
    >({
      query: (params) => ({ url: BASE_URL, params: params ?? {} }),
      transformResponse: (res: FindAllRecordsResultDto) => ({
        ...res,
        docs: res.docs.map((record) => ({
          ...record,
          author:
            typeof record.author === "string"
              ? { _id: record.author }
              : record.author,
        })),
      }),
      providesTags: (result) =>
        result?.docs
          ? [
              ...result.docs.map((record) => ({
                type: "Record" as const,
                id: record._id,
              })),
              { type: "Record", id: "LIST" },
            ]
          : [{ type: "Record", id: "LIST" }],
    }),
    getRecord: builder.query<IRecord, string>({
      query: (id) => `${BASE_URL}/${id}`,
      providesTags: (_, __, id) => [{ type: "Record", id }],
    }),
    createRecord: builder.mutation<IRecord, CreateRecordDto>({
      query: (dto) => ({
        url: BASE_URL,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "Record", id: "LIST" }],
    }),
    updateRecord: builder.mutation<
      Record,
      { id: string; dto: UpdateRecordDto }
    >({
      query: ({ id, dto }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Record", id },
        { type: "Record", id: "LIST" },
      ],
    }),
    deleteRecord: builder.mutation<
      {
        record: Record;
        photos: { deleted: (void | RecordPhoto)[]; failed: string[] };
      },
      string
    >({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Record"],
    }),

    // Photos endpoints
    uploadPhoto: builder.mutation<
      RecordPhoto,
      {
        recordId: string;
        file: File | Blob;
        dto: PhotoDto;
        onUploadProgress?: (progressEvent: ProgressEvent) => void;
      }
    >({
      query: ({ recordId, file, dto }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (dto.comment) {
          formData.append("comment", dto.comment);
        }
        return {
          url: `${BASE_URL}/${recordId}/photos`,
          method: "POST",
          body: formData,
          // No need to explicitly set headers here; fetch handles it for FormData.
        };
      },
      // RTK Query currently does not support onUploadProgress directly.
      // You might need to handle it manually with axios or another lib if progress is critical.
      invalidatesTags: (_, __, { recordId }) => [
        { type: "Record", id: recordId },
      ],
    }),
    deletePhoto: builder.mutation<
      RecordPhoto,
      { recordId: string; photoId: string }
    >({
      query: ({ recordId, photoId }) => ({
        url: `${BASE_URL}/${recordId}/photos/${photoId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { recordId }) => [
        { type: "Record", id: recordId },
      ],
    }),
    updatePhoto: builder.mutation<
      RecordPhoto,
      { recordId: string; photoId: string; dto: UpdatePhotoDto }
    >({
      query: ({ recordId, photoId, dto }) => ({
        url: `${BASE_URL}/${recordId}/photos/${photoId}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: (_, __, { recordId }) => [
        { type: "Record", id: recordId },
      ],
    }),
  }),
});

export const {
  useGetRecordsQuery,
  useGetRecordQuery,
  useLazyGetRecordQuery,
  useLazyGetRecordsQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
  useUploadPhotoMutation,
  useDeletePhotoMutation,
  useUpdatePhotoMutation,
} = recordsApi;
