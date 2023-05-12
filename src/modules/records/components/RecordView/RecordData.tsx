import dayjs from "dayjs";
import React from "react";
import { Accordion, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Address,
  Record,
  RecordPhoto,
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
            <Accordion.Body>{content}</Accordion.Body>
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

const PhotoItem: React.FC<{ photo: RecordPhoto }> = ({ photo }) => {
  return (
    <Card className="m-1" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={photo.url} />
      {photo.comment && (
        <Card.Body>
          <Card.Text>{photo.comment}</Card.Text>
        </Card.Body>
      )}
    </Card>
  );
};
const PhotoList: React.FC<{ photos: RecordPhoto[] }> = ({ photos }) => {
  return (
    <ListGroup.Item className="d-flex flex-wrap justify-content-around align-items-start">
      {photos.map((photo) => (
        <PhotoItem key={photo._id} photo={photo} />
      ))}
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
