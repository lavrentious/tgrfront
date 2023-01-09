import React from "react";
import { useDrop } from "react-dnd";
import arrayMove from "src/modules/common/utils/arrayMove";
import { useAppDispatch } from "src/store";
import { IFile, setFiles } from "src/store/createSpot.reducer";
import ImageItem from "./ImageItem";

interface ImageListProps {
  files: IFile[];
}

const ImageList: React.FC<ImageListProps> = ({ files }) => {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop(() => ({ accept: "IMAGE" }));

  const findImage = (url: string) => {
    const index = files.findIndex((c) => c.file.url === url);
    return {
      file: index === -1 ? null : files[index],
      index,
    };
  };
  const moveImage = (url: string, atIndex: number): void => {
    const { index } = findImage(url);
    dispatch(setFiles(arrayMove(files, atIndex, index)));
  };

  return (
    <div className="w-100 flex-wrap align-items-start" ref={drop}>
      {files.map((file, i) => (
        <ImageItem
          key={file.file.url}
          file={file}
          index={i}
          fileCount={files.length}
          moveImage={moveImage}
        />
      ))}
    </div>
  );
};

export default ImageList;
