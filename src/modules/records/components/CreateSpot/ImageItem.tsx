import clsx from "clsx";
import { Button, CloseButton } from "react-bootstrap";
import {
  ArrowDown as MoveDownIcon,
  ArrowUp as MoveUpIcon,
} from "react-bootstrap-icons";
import bytesToHumanSize from "src/modules/common/utils/bytesToHumanSize";

import React, { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { deleteFile } from "./CreateSpotForm";

interface IFile {
  name: string;
  size: number;
  url: string;
}

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
  const { files } = useSelector((state: RootState) => state.createSpot);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "IMAGE",
      item: { url: file.url, index } as IItem,
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
    [file.url, index, moveImage]
  );
  const [, drop] = useDrop(
    () => ({
      accept: "IMAGE",
      hover(item: IItem) {
        if (item.url !== file.url) {
          const overIndex = files.indexOf(file.url);
          moveImage(item.url, overIndex);
        }
      },
    }),
    [moveImage]
  );

  return (
    <div
      className={clsx(
        "d-flex",
        "justify-content-between",
        "create-spot__form-image-item",
        isDragging ? "opacity-0" : "opacity-100"
      )}
      ref={(node) => drag(drop(node))}
    >
      <div className="d-flex">
        <div className="d-flex flex-column justify-content-center">
          {index !== 0 && (
            <Button
              className="p-0 text-muted line-height-0"
              variant="transparent"
              onClick={() => moveImage(file.url, index - 1)}
            >
              <MoveUpIcon />
            </Button>
          )}
          {index < fileCount - 1 && (
            <Button
              className="p-0 text-muted line-height-0"
              variant="transparent"
              onClick={() => moveImage(file.url, index + 1)}
            >
              <MoveDownIcon />
            </Button>
          )}
        </div>
        <img
          src={file.url}
          alt={file.name}
          className="create-spot__form-image img-thumbnail m-1"
        />
        <span className="text-break text-wrap">{file.name}</span>
        <small className="text-muted ms-1">
          ({bytesToHumanSize(file.size)})
        </small>
      </div>
      <CloseButton
        className="bg-light my-auto"
        onClick={() => deleteFile(file.url, dispatch)}
      />
    </div>
  );
});

export default ImageItem;
