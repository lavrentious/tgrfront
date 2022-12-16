import React from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import arrayMove from "src/modules/common/utils/arrayMove";
import { RootState, useAppDispatch } from "src/store";
import { setFiles } from "src/store/createSpotReducer";
import ImageItem from "./ImageItem";

interface ImageListProps {
  filesMap: Map<string, File>;
}

const ImageList: React.FC<ImageListProps> = ({ filesMap }) => {
  const dispatch = useAppDispatch();
  const { files } = useSelector((state: RootState) => state.createSpot);

  const [, drop] = useDrop(() => ({ accept: "IMAGE" }));

  const findImage = (url: string) => {
    const file = files.filter((c) => c === url)[0];
    return {
      file,
      index: files.indexOf(file),
    };
  };
  const moveImage = (url: string, atIndex: number): void => {
    const { index } = findImage(url);
    dispatch(setFiles(arrayMove(files, atIndex, index)));
  };

  return (
    <div className="w-100 flex-wrap align-items-start" ref={drop}>
      {files.map((url, i) => {
        const f = filesMap.get(url);
        if (!f) return <></>;
        const { name, size }: File = f;
        return (
          <ImageItem
            file={{ name, size, url }}
            key={url}
            index={i}
            fileCount={files.length}
            moveImage={moveImage}
          />
        );
      })}
    </div>
  );
};

export default ImageList;
