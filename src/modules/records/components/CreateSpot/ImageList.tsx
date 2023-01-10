import React from "react";
import { useDrop } from "react-dnd";
import arrayMove from "src/modules/common/utils/arrayMove";
import { useAppDispatch } from "src/store";
import { CreateSpotState, setFiles } from "src/store/createSpot.reducer";
import ImageItem from "./ImageItem";

interface ImageListProps {
  files: CreateSpotState["files"];
}

const ImageList: React.FC<ImageListProps> = ({ files }) => {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop(() => ({ accept: "IMAGE" }));

  const findImage = (url: string) => {
    const index = files.allIds.indexOf(url);
    return {
      file: index === -1 ? null : files.byId[files.allIds[index]],
      index,
    };
  };
  const moveImage = (url: string, atIndex: number): void => {
    const { index } = findImage(url);
    dispatch(setFiles(arrayMove(files.allIds, atIndex, index)));
  };

  return (
    <div className="w-100 flex-wrap align-items-start" ref={drop}>
      {files.allIds.map((url, i) => (
        <ImageItem
          key={url}
          file={files.byId[url]}
          index={i}
          fileCount={files.allIds.length}
          moveImage={moveImage}
        />
      ))}
    </div>
  );
};

export default ImageList;
