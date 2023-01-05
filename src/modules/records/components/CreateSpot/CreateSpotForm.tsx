import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { SpotType } from "src/modules/records/models/record.model";
import { RootState, useAppDispatch } from "src/store";
import { removeFile } from "src/store/createSpot.reducer";
import * as yup from "yup";
import { RecordsService } from "../../services/records.service";
import "./CreateSpot.css";
import FileUploadField from "./FileUploadField";
import ImageList from "./ImageList";

const MAX_FILES_COUNT = 10;
const filesMap: Map<string, File> = new Map();
export const deleteFile = (
  url: string,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  filesMap.delete(url);
  dispatch(removeFile(url));
  URL.revokeObjectURL(url);
};

const TYPE_PLACEHOLDER = "null";

interface Values {
  name: string;
  description?: string;
  accessibility?: string;
  type: SpotType | typeof TYPE_PLACEHOLDER;
}

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().notRequired(),
  accessibility: yup.string().notRequired(),
  type: yup.mixed<SpotType>().oneOf(Object.values(SpotType)).required(),
});

const CreateSpotForm = () => {
  const { files } = useSelector((state: RootState) => state.createSpot);
  const f = useFormik<Values>({
    initialValues: {
      name: "",
      description: "",
      accessibility: "",
      type: TYPE_PLACEHOLDER,
    },
    onSubmit: (values) => {
      // TODO
    },
    validationSchema,
    validateOnBlur: true,
  });

  return (
    <>
      <Form id="createSpotFormId" onSubmit={f.handleSubmit}>
        <Form.FloatingLabel label="Название" className="mb-2">
          <Form.Control
            type="text"
            placeholder="Введите название места"
            autoComplete="off"
            id="name"
            value={f.values.name}
            isInvalid={f.touched.name && !!f.errors.name}
            isValid={f.touched.name && !f.errors.name}
            onChange={f.handleChange}
          />
        </Form.FloatingLabel>
        <Form.FloatingLabel label="Описание" className="mb-2">
          <Form.Control
            as="textarea"
            placeholder="Введите описание места"
            className="create-spot__form-description"
            autoComplete="off"
            id="description"
            value={f.values.description}
            isInvalid={f.touched.description && !!f.errors.description}
            isValid={f.touched.description && !f.errors.description}
            onChange={f.handleChange}
          />
        </Form.FloatingLabel>
        <Form.FloatingLabel
          label="Информация о доступности для незрячих"
          className="mb-2"
        >
          <Form.Control
            as="textarea"
            placeholder="Введите описание места"
            className="create-spot__form-description"
            autoComplete="off"
            id="accessibility"
            value={f.values.accessibility}
            isInvalid={f.touched.accessibility && !!f.errors.accessibility}
            isValid={f.touched.accessibility && !f.errors.accessibility}
            onChange={f.handleChange}
          />
        </Form.FloatingLabel>
        <Form.FloatingLabel label="Тип места" className="mb-2">
          <Form.Select
            id="type"
            value={f.values.type}
            isInvalid={f.touched.type && !!f.errors.type}
            isValid={f.touched.type && !f.errors.type}
            onChange={f.handleChange}
          >
            <option disabled value={TYPE_PLACEHOLDER}>
              Выберите тип
            </option>
            <option value={SpotType.SIGHT}>
              Интересное (достопримечательность)
            </option>
            <option value={SpotType.USEFUL}>Полезное</option>
            <option value={SpotType.MISC}>Прочее</option>
          </Form.Select>
        </Form.FloatingLabel>
        <FileUploadField
          maxFilesCount={MAX_FILES_COUNT}
          filesCount={files.length}
          filesMap={filesMap}
        />
        {files.length >= 2 && (
          <Form.Text>
            Вы можете изменить порядок изображений, перетаскивая их
          </Form.Text>
        )}
        <DndProvider backend={HTML5Backend}>
          <ImageList filesMap={filesMap} />
        </DndProvider>
      </Form>
    </>
  );
};

export default CreateSpotForm;
