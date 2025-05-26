import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import { getDisplayAddress } from "../../utils";
import type { CreateSpotValues } from "./types";

interface AddressFormProps {
  f: ReturnType<typeof useFormik<CreateSpotValues>>;
  noAutoDisplayName?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ f, noAutoDisplayName }) => {
  const prevAddressRef = useRef(f.values.address);

  useEffect(() => {
    const prev = prevAddressRef.current;
    const current = f.values.address;
    if (
      !noAutoDisplayName &&
      !f.touched.address?.displayName &&
      (prev.city !== current.city ||
        prev.region !== current.region ||
        prev.street !== current.street ||
        prev.house !== current.house)
    ) {
      prevAddressRef.current = current;
      f.setFieldValue("address.displayName", getDisplayAddress(current));
    }
  }, [f, noAutoDisplayName]);

  return (
    <>
      <Form.FloatingLabel label="Регион (напр., 'Алтайский край')">
        <Form.Control
          className="mb-2"
          placeholder="Введите субъект"
          autoComplete="off"
          id="address.region"
          value={f.values.address?.region}
          isInvalid={f.touched.address?.region && !!f.errors.address?.region}
          isValid={f.touched.address?.region && !f.errors.address?.region}
          onChange={f.handleChange}
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Город (напр., 'г Бийск')">
        <Form.Control
          className="mb-2"
          placeholder="Введите город"
          autoComplete="off"
          id="address.city"
          value={f.values.address?.city}
          isInvalid={f.touched.address?.city && !!f.errors.address?.city}
          isValid={f.touched.address?.city && !f.errors.address?.city}
          onChange={f.handleChange}
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Улица (напр., 'ул Ленина')">
        <Form.Control
          className="mb-2"
          placeholder="Введите улицу"
          autoComplete="off"
          id="address.street"
          value={f.values.address?.street}
          isInvalid={f.touched.address?.street && !!f.errors.address?.street}
          isValid={f.touched.address?.street && !f.errors.address?.street}
          onChange={f.handleChange}
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Дом/здание (напр., 'д 42')">
        <Form.Control
          className="mb-2"
          placeholder="Введите субъект"
          autoComplete="off"
          id="address.house"
          value={f.values.address?.house}
          isInvalid={f.touched.address?.house && !!f.errors.address?.house}
          isValid={f.touched.address?.house && !f.errors.address?.house}
          onChange={f.handleChange}
        />
      </Form.FloatingLabel>
      <Form.FloatingLabel label="Полный адрес (отображаемый)">
        <Form.Control
          className="mb-2"
          placeholder="Введите полный адрес"
          autoComplete="off"
          id="address.displayName"
          value={f.values.address?.displayName}
          isInvalid={
            f.touched.address?.displayName && !!f.errors.address?.displayName
          }
          isValid={
            f.touched.address?.displayName && !f.errors.address?.displayName
          }
          onChange={f.handleChange}
          onBlur={f.handleBlur}
        />
      </Form.FloatingLabel>
    </>
  );
};

export default AddressForm;
