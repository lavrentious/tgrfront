import React from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { IFile, setFiles } from "src/store/createSpot.reducer";

interface FileUploadFieldProps {
  maxFilesCount: number;
  filesCount: number;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  maxFilesCount,
  filesCount,
}) => {
  const dispatch = useAppDispatch();
  const { files } = useSelector((state: RootState) => state.createSpot);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || filesCount >= maxFilesCount) return;
    const newFiles: IFile[] = [];
    for (const file of Array.from(e.target.files)
      .filter((f) => f.type.startsWith("image/") && !f.type.endsWith("gif"))
      .slice(0, maxFilesCount - filesCount)) {
      newFiles.push({
        file: {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        },
        dto: { comment: "" },
      });
    }
    dispatch(setFiles([...files, ...newFiles]));
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
