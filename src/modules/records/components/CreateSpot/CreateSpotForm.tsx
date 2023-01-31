import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { Record, SpotType } from "src/modules/records/models/record.model";
import { RootState } from "src/store";
import * as yup from "yup";
import "./CreateSpot.css";
import FileUploadField from "./FileUploadField";
import ImageList from "./ImageList";

const MAX_FILES_COUNT = 10;

const TYPE_PLACEHOLDER = -1;

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
  type: yup
    .mixed()
    .oneOf(Object.values(SpotType) as number[])
    .required(),
});

export type CreateSpotFormOnSubmit = (
  values: Values | { type: SpotType }
) => void;
interface CreateSpotFormProps {
  record?: Record;
  onSubmit: CreateSpotFormOnSubmit;
}

const CreateSpotForm: React.FC<CreateSpotFormProps> = ({
  record,
  onSubmit,
}) => {
  const { files, isFormDisabled } = useSelector(
    (state: RootState) => state.createSpot
  );
  const f = useFormik<Values>({
    initialValues: {
      name: record?.name ?? "",
      description: record?.description ?? "",
      accessibility: record?.accessibility ?? "",
      type: record?.type ?? TYPE_PLACEHOLDER,
    },
    onSubmit,
    validationSchema,
    validateOnBlur: true,
  });
  return (
    <>
      <fieldset disabled={isFormDisabled}>
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
              itemType="number"
              value={f.values.type}
              isInvalid={f.touched.type && !!f.errors.type}
              isValid={f.touched.type && !f.errors.type}
              onChange={(e) => {
                f.setFieldValue("type", +e.target.value);
              }}
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
            filesCount={files.allIds.length}
          />
          {files.allIds.length >= 2 && (
            <Form.Text>
              Вы можете изменить порядок изображений, перетаскивая их
            </Form.Text>
          )}
          <DndProvider backend={HTML5Backend}>
            <ImageList files={files} />
          </DndProvider>
        </Form>
      </fieldset>
    </>
  );
};

export default CreateSpotForm;
