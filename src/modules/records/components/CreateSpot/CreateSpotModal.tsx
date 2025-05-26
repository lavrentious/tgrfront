import { Button, Modal } from "react-bootstrap";
import {
  DashLg as HideIcon,
  CheckLg as SubmitIcon,
} from "react-bootstrap-icons";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { type RootState, useAppDispatch } from "src/store";
import {
  resetForm,
  setFileStatus,
  setIsCreationFormShown,
  setIsFormDisabled,
  updateFile,
} from "src/store/createSpot.reducer";
import {
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useUploadPhotoMutation,
} from "../../api/records.api";
import type { CreateRecordDto } from "../../dto/create-record.dto";
import type { RecordPhoto } from "../../models/record.model";
import { FileStatus } from "../../records.types";
import CreateSpotForm, { type CreateSpotFormOnSubmit } from "./CreateSpotForm";
import { TYPE_PLACEHOLDER } from "./types";

const CreateSpotModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedSpot, isCreationFormShown, isFormDisabled, files } =
    useSelector((state: RootState) => state.createSpot);

  const [createRecord] = useCreateRecordMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [updateRecord] = useUpdateRecordMutation();

  const onSubmit: CreateSpotFormOnSubmit = async (values) => {
    if (!selectedSpot || values.type === TYPE_PLACEHOLDER) return;

    dispatch(setIsFormDisabled(true));

    try {
      const createDto: CreateRecordDto = {
        ...values,
        lat: selectedSpot[0],
        lon: selectedSpot[1],
      } as CreateRecordDto;

      const record = await createRecord(createDto).unwrap();

      const photos = files.allIds.map((url) => files.byId[url]);
      const uploaded: RecordPhoto[] = [];
      const failed: { i: number; url: string; error: string }[] = [];
      const photoIds: string[] = [];

      await Promise.all(
        photos.map(async (photo, i) => {
          dispatch(
            setFileStatus({
              url: photo.file.url,
              status: FileStatus.PENDING,
            }),
          );

          await uploadPhoto({
            recordId: record._id,
            file: await fetch(photo.file.url).then((r) => r.blob()),
            dto: photo.dto,
          })
            .unwrap()
            .then((result) => {
              uploaded.push(result);
              photoIds.push(result._id);

              dispatch(
                updateFile({
                  url: photo.file.url,
                  value: {
                    ...photo,
                    meta: {
                      ...photo.meta,
                      progress: photo.file.size,
                      status: FileStatus.SUCCESS,
                      fromDB: result,
                    },
                  },
                }),
              );
            })
            .catch((error) => {
              failed.push({
                i,
                url: photo.file.url,
                error: error?.data?.message ?? "Ошибка загрузки",
              });

              dispatch(
                setFileStatus({
                  url: photo.file.url,
                  status: FileStatus.FAILED,
                }),
              );
            });
        }),
      );

      await updateRecord({
        id: record._id,
        dto: { photos: photoIds },
      }).unwrap();

      for (const photo of failed) {
        toast.error(`Фото №${photo.i + 1} не добавлено: ${photo.error}`);
      }

      dispatch(resetForm());
      dispatch(setIsCreationFormShown(false));
      navigate(`/record/${record._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при создании записи");
    } finally {
      dispatch(setIsFormDisabled(false));
    }
  };

  return (
    <Modal
      show={selectedSpot != null && isCreationFormShown}
      onHide={() => dispatch(setIsCreationFormShown(false))} // TODO: save form data on close modal
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Создание нового места</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateSpotForm onSubmit={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          title="Свернуть форму. Данные сохранятся."
          onClick={() => dispatch(setIsCreationFormShown(false))}
        >
          <HideIcon /> Свернуть (вернуться к выбору места)
        </Button>
        <LoadingButton
          variant="success"
          type="submit"
          form="createSpotFormId"
          isLoading={isFormDisabled}
          icon={<SubmitIcon />}
        >
          Создать
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateSpotModal;
