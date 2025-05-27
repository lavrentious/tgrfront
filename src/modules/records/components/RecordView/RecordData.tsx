import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Accordion, Card, ListGroup } from "react-bootstrap";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Link } from "react-router-dom";
import {
  type Address,
  Record,
  type RecordPhoto,
  SpotType,
} from "../../models/record.model";
import MapPreview from "./MapPreview";
import "./recordData.css";

interface RecordDataProps {
  record: Record;
}

const LongTextItem: React.FC<{
  title: string;
  content: string | undefined;
}> = ({ title, content }) => {
  if (!content) return <></>;
  if (content.length >= 500 || content.includes("\n"))
    return (
      <ListGroup.Item className="p-0">
        <Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Body>
              {content.split("\n").map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ListGroup.Item>
    );
  return (
    <ListGroup.Item>
      {title}: {content}
    </ListGroup.Item>
  );
};

export const SpotTypeItem: React.FC<{ type: SpotType }> = ({ type }) => {
  switch (type) {
    case SpotType.SIGHT:
      return <>Достопримечательность</>;
    case SpotType.USEFUL:
      return <>Полезное</>;
    case SpotType.MISC:
      return <>Прочее</>;
    default:
      return <i>недоступно</i>;
  }
};

export const DateItem: React.FC<{ date: Date; title: string }> = ({
  date,
  title,
}) => {
  return (
    <ListGroup.Item>
      {title}: {dayjs(date).fromNow()} ({dayjs(date).format("LLL")})
    </ListGroup.Item>
  );
};
const AddressItem: React.FC<{ address: Address }> = ({ address }) => {
  const items: { name: string; value: string | undefined }[] = [
    {
      name: "Регион",
      value: address.region,
    },
    {
      name: "Город (н. п.)",
      value: address.city,
    },
    {
      name: "Улица",
      value: address.street,
    },
    {
      name: "Здание",
      value: address.house,
    },
  ];
  return (
    <ListGroup.Item className="p-0">
      <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Адрес: {address.displayName}</Accordion.Header>
          <Accordion.Body className="p-0 border">
            {items.map((i) => (
              <ListGroup.Item className="ps-4" key={i.name}>
                {i.value != null ? (
                  <>
                    {i.name}: {i.value}
                  </>
                ) : (
                  <span className="text-muted fst-italic">{i.name}: н/д</span>
                )}
              </ListGroup.Item>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </ListGroup.Item>
  );
};

const PhotoList: React.FC<{ photos: RecordPhoto[] }> = ({ photos }) => {
  const urlsToComments = useMemo(() => {
    return photos.reduce(
      (acc, photo) => {
        if (photo.url) {
          acc[photo.url] = photo.comment || "";
        }
        return acc;
      },
      {} as { [url: string]: string },
    );
  }, [photos]);

  return (
    <ListGroup.Item className="d-flex flex-wrap justify-content-center align-items-start">
      <PhotoProvider
        toolbarRender={(e) => <>{urlsToComments[e.images[e.index].src!]}</>}
      >
        {photos.map((photo) => (
          <PhotoView key={photo._id} src={photo.url}>
            <Card className="m-3" style={{ maxWidth: "18rem" }}>
              <Card.Img src={photo.url} alt={photo.comment} />
              {photo.comment?.trim() && <Card.Body>{photo.comment}</Card.Body>}
            </Card>
          </PhotoView>
        ))}
      </PhotoProvider>
    </ListGroup.Item>
  );
};

const RecordData: React.FC<RecordDataProps> = ({ record }) => {
  return (
    <ListGroup className="record-data__container">
      <ListGroup.Item>
        Автор:{" "}
        <Link to={`/profile/${record.author._id}`}>
          {record.author.username ?? record.author._id}
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>Название: {record.name}</ListGroup.Item>
      <LongTextItem title="Описание" content={record.description} />
      <LongTextItem title="Доступность" content={record.accessibility} />
      <AddressItem address={record.address} />
      <ListGroup.Item>
        Тип: <SpotTypeItem type={record.type} />
      </ListGroup.Item>
      <DateItem date={record.createdAt} title="Дата создания" />
      <DateItem date={record.updatedAt} title="Дата изменения" />
      {record.photos.length > 0 && <PhotoList photos={record.photos} />}
      <ListGroup.Item>
        <MapPreview record={record} />
      </ListGroup.Item>
    </ListGroup>
  );
};

export default RecordData;
