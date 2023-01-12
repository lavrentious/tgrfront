import React from "react";
import { useDrop } from "react-dnd";
import { CreateSpotState, moveFile } from "src/store/createSpot.reducer";
import ImageItem from "./ImageItem";

interface ImageListProps {
  files: CreateSpotState["files"];
}

const ImageList: React.FC<ImageListProps> = ({ files }) => {
  const [, drop] = useDrop(() => ({ accept: "IMAGE" }));

  return (
    <div className="w-100 flex-wrap align-items-start" ref={drop}>
      {files.allIds.map((url, i) => (
        <ImageItem
          key={url}
          file={files.byId[url]}
          index={i}
          fileCount={files.allIds.length}
          moveFile={moveFile}
        />
      ))}
    </div>
  );
};

export default ImageList;
