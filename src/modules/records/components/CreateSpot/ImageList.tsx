import React from "react";
import { useDrop } from "react-dnd";
import { useAppDispatch } from "src/store";
import { type CreateSpotState, moveFile } from "src/store/createSpot.reducer";
import ImageItem from "./ImageItem";

interface ImageListProps {
  files: CreateSpotState["files"];
}

const ImageList: React.FC<ImageListProps> = ({ files }) => {
  const [, drop] = useDrop(() => ({ accept: "IMAGE" }));
  const dispatch = useAppDispatch();

  return (
    // @ts-expect-error seems to work?
    <div className="w-100 flex-wrap align-items-start" ref={drop}>
      {files.allIds.map((url, i) => (
        <ImageItem
          key={url}
          file={files.byId[url]}
          index={i}
          fileCount={files.allIds.length}
          moveFile={(fromIndex: number, toIndex: number) =>
            dispatch(moveFile(fromIndex, toIndex))
          }
        />
      ))}
    </div>
  );
};

export default ImageList;
