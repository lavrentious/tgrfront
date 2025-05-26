import React, { useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  XLg as CancelIcon,
  CheckLg as SubmitIcon,
} from "react-bootstrap-icons";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatApiError, isApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { type RootState, useAppDispatch } from "src/store";
import {
  addFile,
  resetForm,
  setFileProgress,
  setFiles,
  setFileStatus,
  setIsCreationFormShown,
  setIsFormDisabled,
} from "src/store/createSpot.reducer";
import {
  useDeletePhotoMutation,
  useUpdatePhotoMutation,
  useUpdateRecordMutation,
  useUploadPhotoMutation,
} from "../../api/records.api";
import type { UploadPhotoDto } from "../../dto/upload-photo.dto";
import type { Record, RecordPhoto } from "../../models/record.model";
import { FileStatus } from "../../records.types";
import CreateSpotForm, {
  type CreateSpotFormOnSubmit,
} from "../CreateSpot/CreateSpotForm";

interface EditSpotModalProps {
  record: Record;
  onSuccess?: () => void;
}

const EditSpotModal: React.FC<EditSpotModalProps> = ({ record, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { isCreationFormShown, isFormDisabled, files } = useSelector(
    (state: RootState) => state.createSpot,
  );

  const [updateRecord] = useUpdateRecordMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [updatePhoto] = useUpdatePhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  const initPhotos = useRef<RecordPhoto[]>([]);

  useEffect(() => {
    if (isFormDisabled) return;
    initPhotos.current = record.photos.slice();
    // console.log("init photos", initPhotos.current);
    dispatch(resetForm());

    if (isCreationFormShown) {
      for (const photo of record.photos) {
        dispatch(
          addFile({
            dto: { comment: photo.comment },
            file: { name: photo.url, url: photo.url, size: 0 },
            meta: { fromDB: photo },
          }),
        );
      }
      dispatch(setFiles(record.photos.map((p) => p.url)));
    }
  }, [dispatch, isCreationFormShown, isFormDisabled, record.photos]);

  const onSubmit: CreateSpotFormOnSubmit = async (values) => {
    dispatch(setIsFormDisabled(true));

    const allPhotos: UploadPhotoDto[] = files.allIds.map(
      (url) => files.byId[url],
    );
    const addedPhotos: UploadPhotoDto[] = allPhotos.filter(
      (p) => initPhotos.current.findIndex((ip) => ip.url === p.file.url) === -1,
    );
    const removedPhotos = initPhotos.current.filter(
      (ip) => allPhotos.findIndex((p) => p.file.url === ip.url) === -1,
    );

    const changedPhotos = allPhotos
      .filter((p) => {
        const ip = initPhotos.current.find((ip) => p.file.url === ip.url);
        return ip && ip.comment !== p.dto.comment;
      })
      .map((p) => {
        const ip = initPhotos.current.find((ip) => ip.url === p.file.url);
        if (!ip) return null;
        return { id: ip._id, file: p.file, dto: p.dto };
      })
      .filter((p) => p != null);

    // console.log("allPhotos", allPhotos);
    // console.log("addedPhotos", addedPhotos);
    // console.log("removedPhotos", removedPhotos);
    // console.log("changedPhotos", changedPhotos);

    try {
      // console.log("deleting", removedPhotos);
      await Promise.all(
        removedPhotos.map(
          async (photo) =>
            await deletePhoto({
              recordId: record._id,
              photoId: photo._id,
            }).unwrap(),
        ),
      );
      // console.log("deleted");

      await Promise.all(
        changedPhotos.map(async (photo) => {
          dispatch(
            setFileStatus({
              url: photo.file.url,
              status: FileStatus.PENDING,
            }),
          );
          // console.log("updating", photo);
          try {
            await updatePhoto({
              recordId: record._id,
              photoId: photo.id,
              dto: photo.dto,
            }).unwrap();
            dispatch(
              setFileStatus({
                url: photo.file.url,
                status: FileStatus.SUCCESS,
              }),
            );
          } catch {
            dispatch(
              setFileStatus({
                url: photo.file.url,
                status: FileStatus.FAILED,
              }),
            );
          }
        }),
      );
      // console.log("updated");

      const idsByUrls = new Map<string, string>();
      for (const photo of allPhotos) {
        const fromDB = photo.meta?.fromDB;
        if (fromDB) {
          idsByUrls.set(photo.file.url, fromDB._id);
        }
      }

      await Promise.all(
        addedPhotos.map(async (photo) => {
          // console.log("uploading", photo);
          const blob = await fetch(photo.file.url).then((r) => r.blob());
          try {
            dispatch(
              setFileStatus({
                url: photo.file.url,
                status: FileStatus.PENDING,
              }),
            );
            const fromDB = await uploadPhoto({
              recordId: record._id,
              file: blob,
              dto: photo.dto,
            }).unwrap();
            idsByUrls.set(photo.file.url, fromDB._id);
            dispatch(
              setFileStatus({
                url: photo.file.url,
                status: FileStatus.SUCCESS,
              }),
            );
            dispatch(
              setFileProgress({
                url: photo.file.url,
                progress: photo.file.size,
              }),
            );
          } catch {
            dispatch(
              setFileStatus({
                url: photo.file.url,
                status: FileStatus.FAILED,
              }),
            );
          }
        }),
      );
      // console.log("uploaded");

      // console.log("reordering");
      const photosIds = allPhotos
        .map((p) => idsByUrls.get(p.file.url))
        .filter(Boolean) as string[];
      // Update the record with new data and photo IDs
      await updateRecord({
        id: record._id,
        dto: {
          ...values,
          photos: photosIds,
        },
      }).unwrap();
      // console.log("done");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      if (isApiError(error)) {
        toast.error(formatApiError(error));
      }
    } finally {
      dispatch(setIsCreationFormShown(false));
      dispatch(setIsFormDisabled(false));
    }
  };

  return (
    <Modal
      show={isCreationFormShown}
      onHide={() => dispatch(setIsCreationFormShown(false))}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Изменение места ({record.name})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateSpotForm record={record} onSubmit={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => dispatch(setIsCreationFormShown(false))}
        >
          <CancelIcon /> Отмена
        </Button>
        <LoadingButton
          variant="success"
          type="submit"
          form="createSpotFormId"
          isLoading={isFormDisabled}
          icon={<SubmitIcon />}
        >
          Подтвердить
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSpotModal;
