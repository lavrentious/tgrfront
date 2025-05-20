import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "src/store";
import { setIsSelectingSpot } from "src/store/createSpot.reducer";
import "./mapView.css";

const SelectingSpotNotification = () => {
  const isSelectingSpot = useSelector(
    (state: RootState) => state.createSpot.isSelectingSpot,
  );
  const dispatch = useDispatch();
  return (
    <ToastContainer className="map-view__toast" position="bottom-center">
      <Toast
        show={isSelectingSpot}
        onClose={() => dispatch(setIsSelectingSpot(false))}
      >
        <Toast.Header>
          <strong className="me-auto">Нажмите на карту для выбора места</strong>
        </Toast.Header>
        <Toast.Body>Закройте это уведомление для отмены</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default SelectingSpotNotification;
