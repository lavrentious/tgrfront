import useDebouncedCallback from "beautiful-react-hooks/useDebouncedCallback";
import clsx from "clsx";
import React, { memo, useMemo, useRef, useState } from "react";
import { Button, CloseButton, FormControl } from "react-bootstrap";
import {
  ArrowDown as MoveDownIcon,
  ArrowUp as MoveUpIcon,
} from "react-bootstrap-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import bytesToHumanSize from "src/modules/common/utils/bytesToHumanSize";
import { RootState, useAppDispatch } from "src/store";
import { deleteFile, IFile, updateFile } from "src/store/createSpot.reducer";
import StatusIcon from "./StatusIcon";

export interface IItem {
  url: string;
  index: number;
}

interface ImageItemProps {
  file: IFile;
  index: number;
  fileCount: number;
  moveFile: (fromIndex: number, toIndex: number) => void;
}

const ImageItem: React.FC<ImageItemProps> = memo(function ImageItem({
  file,
  index,
  fileCount,
  moveFile,
}: ImageItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { isFormDisabled } = useSelector(
    (state: RootState) => state.createSpot
  );
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "IMAGE",
      item: { url: file.file.url, index } as IItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [file.file.url, index, moveFile]
  );
  const [, drop] = useDrop<IItem>(
    () => ({
      accept: "IMAGE",
      hover(item: IItem) {
        if (item.index === index) return;
        moveFile(item.index, index);
        item.index = index;
      },
    }),
    [moveFile, index]
  );

  const [comment, setComment] = useState<string>(file.dto.comment ?? "");
  const saveCommentToStore = (comment: string) => {
    if (file.dto.comment === comment) return;
    dispatch(
      updateFile({
        url: file.file.url,
        value: { ...file, dto: { comment } },
      })
    );
  };
  const debouncedSave = useDebouncedCallback(
    saveCommentToStore,
    [dispatch],
    500
  );

  const progress = useMemo(
    () => Math.round(((file.meta?.progress ?? 0) / file.file.size) * 100),
    [file.meta?.progress]
  );

  drag(drop(ref));

  return (
    <div
      className={clsx(
        "d-flex justify-content-between",
        "create-spot__form-image-item",
        "p-2",
        "my-2",
        "border rounded",
        isDragging ? "opacity-0" : "opacity-100"
      )}
      onDragStart={(e) => {
        if (isFormDisabled) e.preventDefault();
      }}
      ref={ref}
    >
      <div className="d-flex flex-column justify-content-center">
        {!isFormDisabled && index !== 0 && (
          <Button
            className="p-0 text-muted line-height-0"
            variant="transparent"
            onClick={() => moveFile(index, index - 1)}
          >
            <MoveUpIcon />
          </Button>
        )}
        {!isFormDisabled && index < fileCount - 1 && (
          <Button
            className="p-0 text-muted line-height-0"
            variant="transparent"
            onClick={() => moveFile(index, index + 1)}
          >
            <MoveDownIcon />
          </Button>
        )}
      </div>
      <div>
        <img
          src={file.file.url}
          alt={file.file.name}
          className="create-spot__form-image img-thumbnail m-1"
        />
        <StatusIcon status={file.meta?.status ?? null} />
      </div>
      <div className="d-flex flex-column w-100 mx-2">
        <div>
          <span className="text-break text-wrap">
            {file.file.name}{" "}
            {file.file.size > 0 && (
              <small className="text-muted">
                ({bytesToHumanSize(file.file.size)})
              </small>
            )}
          </span>
        </div>
        <div>
          <FormControl
            as="textarea"
            placeholder="Тифлокомментарий"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              debouncedSave(e.target.value);
            }}
            onBlur={(e) => {
              saveCommentToStore(e.target.value);
            }}
          />
        </div>
        {isFormDisabled && file.file.size !== 0 && (
          <ProgressBar now={progress} label={`${progress}%`} />
        )}
      </div>
      <CloseButton
        disabled={isFormDisabled}
        className="bg-light my-auto"
        onClick={() => deleteFile(file.file.url, dispatch)}
      />
    </div>
  );
});

export default ImageItem;
