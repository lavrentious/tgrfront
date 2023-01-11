import React from "react";
import { Form } from "react-bootstrap";
import { useAppDispatch } from "src/store";
import { addFile } from "src/store/createSpot.reducer";

interface FileUploadFieldProps {
  maxFilesCount: number;
  filesCount: number;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  maxFilesCount,
  filesCount,
}) => {
  const dispatch = useAppDispatch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || filesCount >= maxFilesCount) return;
    for (const file of Array.from(e.target.files)
      .filter((f) => f.type.startsWith("image/") && !f.type.endsWith("gif"))
      .slice(0, maxFilesCount - filesCount)) {
      dispatch(
        addFile({
          file: {
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
          },
          dto: { comment: "" },
          meta: { progress: 0 },
        })
      );
    }
  };
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Прикрепить фотографии{" "}
        {filesCount > 0 && `(${filesCount} из ${maxFilesCount})`}
      </Form.Label>
      <Form.Control
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        disabled={filesCount >= maxFilesCount}
      />
    </Form.Group>
  );
};

export default FileUploadField;
