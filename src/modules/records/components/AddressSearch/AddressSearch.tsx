import axios from "axios";
import { LatLngTuple } from "leaflet";
import React, { FormEvent, useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import { Search as SearchIcon } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import useFetch from "src/modules/common/hooks/useFetch";
import haversine from "src/modules/common/utils/haversine";
import { RootState, useAppDispatch } from "src/store";
import { pickSpot } from "src/store/mapReducer";

type SearchItem = {
  id: string;
  lat: number;
  lng: number;
  address: string;
  icon?: string;
  distance?: number;
};

async function lookupAddress(
  query: string,
  userCoords?: LatLngTuple
): Promise<SearchItem[]> {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query.trim(),
      format: "json",
      "accept-language": "ru",
    },
  });
  let processedRes = res.data.map(
    (e: {
      place_id: number;
      osm_id: number;
      lat: number;
      lon: number;
      icon: string;
      display_name: string;
    }) => ({
      id: e.place_id | e.osm_id,
      lat: +e.lat,
      lng: +e.lon,
      address: e.display_name,
      icon: e.icon,
      ...(userCoords && {
        distance: haversine(e.lat, e.lon, userCoords[0], userCoords[1]),
      }),
    })
  );
  if (userCoords) {
    processedRes = processedRes.sort(
      (
        a: SearchItem & { distance: number },
        b: SearchItem & { distance: number }
      ) => a.distance - b.distance
    );
  }
  return processedRes;
}

const AddressSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<SearchItem[]>([]);
  const userCoords = useSelector((state: RootState) => state.map.userCoords);
  const dispatch = useAppDispatch();

  const { fetch, isFetching } = useFetch(async () => {
    const res = await lookupAddress(query, userCoords || undefined);
    if (res.length === 1) {
      dispatch(pickSpot([res[0].lat, res[0].lng]));
    }
    setResult(res);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch();
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <InputGroup>
            <Form.Control
              autoFocus
              type="text"
              placeholder="Введите адрес или название..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={isFetching || !query.length}
            >
              {isFetching ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <SearchIcon />
              )}
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
      <ListGroup>
        {result.map((e, i) => (
          <ListGroupItem key={e.id}>
            <strong>{i + 1}. </strong>
            <span
              onClick={() => dispatch(pickSpot([e.lat, e.lng]))}
              className="link-primary"
              style={{ cursor: "pointer" }}
            >
              {e.address}
              {e.distance &&
                " (" +
                  (e.distance > 3000
                    ? `${(e.distance / 1000).toFixed(2)} км`
                    : `${e.distance} м`) +
                  ") "}
            </span>
            {e.icon && <img src={e.icon} />}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default AddressSearch;
