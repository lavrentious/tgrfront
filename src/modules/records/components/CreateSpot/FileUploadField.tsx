import React from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setFiles } from "src/store/createSpotReducer";

interface FileUploadFieldProps {
  maxFilesCount: number;
  filesCount: number;
  filesMap: Map<string, File>;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  maxFilesCount,
  filesCount,
  filesMap,
}) => {
  const dispatch = useAppDispatch();
  const { files } = useSelector((state: RootState) => state.createSpot);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || filesCount >= maxFilesCount) return;
    const urls: string[] = [];
    for (const file of Array.from(e.target.files)
      .filter((f) => f.type.startsWith("image/") && !f.type.endsWith("gif"))
      .slice(0, maxFilesCount - filesCount)) {
      const url = URL.createObjectURL(file);
      filesMap.set(url, file);
      urls.push(url);
    }
    dispatch(setFiles([...files, ...urls]));
  };
  // dispatch(
  //   setFiles([
  //     ...files,
  //     ...Array.from(e.target.files!)
  //       .filter((f) => f.type.startsWith("image/") && !f.type.endsWith("gif"))
  //       .slice(0, maxFilesCount - filesCount)
  //       .map((file) => URL.createObjectURL(file)),
  //   ])
  // );
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
