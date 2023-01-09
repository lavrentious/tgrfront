import clsx from "clsx";
import { Button, CloseButton, FormControl } from "react-bootstrap";
import {
  ArrowDown as MoveDownIcon,
  ArrowUp as MoveUpIcon,
} from "react-bootstrap-icons";
import bytesToHumanSize from "src/modules/common/utils/bytesToHumanSize";

import React, { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import {
  deleteFile,
  IFile,
  updateFileComment,
} from "src/store/createSpot.reducer";

interface IItem {
  url: string;
  index: number;
}

interface ImageItemProps {
  file: IFile;
  index: number;
  fileCount: number;
  moveImage: (url: string, atIndex: number) => void;
}

const ImageItem: React.FC<ImageItemProps> = memo(function ImageItem({
  file,
  index,
  fileCount,
  moveImage,
}: ImageItemProps) {
  const dispatch = useAppDispatch();
  const { files, isFormDisabled } = useSelector(
    (state: RootState) => state.createSpot
  );
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "IMAGE",
      item: { url: file.file.url, index } as IItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { url, index } = item;
        if (!monitor.didDrop()) {
          moveImage(url, index);
        }
      },
    }),
    [file.file.url, index, moveImage]
  );
  const [, drop] = useDrop(
    () => ({
      accept: "IMAGE",
      hover(item: IItem) {
        if (item.url !== file.file.url) {
          const overIndex = files.findIndex(
            (f) => f.file.url === file.file.url
          );
          moveImage(item.url, overIndex);
        }
      },
    }),
    [moveImage]
  );

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
      ref={isFormDisabled ? null : (node) => drag(drop(node))}
    >
      <div className="d-flex flex-column justify-content-center">
        {!isFormDisabled && index !== 0 && (
          <Button
            className="p-0 text-muted line-height-0"
            variant="transparent"
            onClick={() => moveImage(file.file.url, index - 1)}
          >
            <MoveUpIcon />
          </Button>
        )}
        {!isFormDisabled && index < fileCount - 1 && (
          <Button
            className="p-0 text-muted line-height-0"
            variant="transparent"
            onClick={() => moveImage(file.file.url, index + 1)}
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
      </div>
      <div className="d-flex flex-column w-100 mx-2">
        <div>
          <span className="text-break text-wrap">
            {file.file.name}{" "}
            <small className="text-muted">
              ({bytesToHumanSize(file.file.size)})
            </small>
          </span>
        </div>
        <div>
          <FormControl
            as="textarea"
            placeholder="Тифлокомментарий"
            value={file.dto.comment}
            onChange={(e) => {
              dispatch(
                updateFileComment({
                  url: file.file.url,
                  value: e.target.value,
                }) // FIXME: dolgo pizdetz
              );
            }}
          />
        </div>
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
