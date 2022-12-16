import React from 'react'
import { Form } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { removeFile } from "src/store/createSpotReducer";
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
const CreateSpotForm = () => {
  const { files } = useSelector((state: RootState) => state.createSpot);

  return (
    <Form>
      <Form.FloatingLabel label="Название" className="mb-2">
        <Form.Control
          type="text"
          placeholder="Введите название места"
          autoComplete="off"
          required
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Описание" className="mb-2">
        <Form.Control
          as="textarea"
          placeholder="Введите описание места"
          className="create-spot__form-description"
          autoComplete="off"
          required
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
          required
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Тип места" className="mb-2">
        <Form.Select defaultValue="">
          <option disabled value="">
            Выберите тип
          </option>
          <option value="INTERESTING">
            Интересное (достопримечательность)
          </option>
          <option value="USEFUL">Полезное</option>
          <option value="MISC">Прочее</option>
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
  );
};

export default CreateSpotForm;
