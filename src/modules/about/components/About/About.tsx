import dayjs from "dayjs";
import * as React from "react";
import { Container, Image, ListGroup } from "react-bootstrap";
import {
  BsPersonLinesFill as ContactsIcon,
  BsEnvelopeAtFill as EmailIcon,
  BsTelegram as TgIcon,
} from "react-icons/bs";
import { useGetHealthQuery } from "src/api/api";
import TgLogo from "src/assets/tg_logo.png";

const About: React.FunctionComponent = () => {
  const { data: health } = useGetHealthQuery();
  return (
    <Container>
      <h1 className="text-center">О проекте</h1>
      <div>
        <Image src={TgLogo} fluid className="float-end" />
        <p>
          IT-платформа <strong>ТифлоГид</strong> - это цифровая платформа для
          реализации туристических практик в сфере социального туризма для людей
          с инвалидностью по зрению. Это полностью доступный для инвалидов по
          зрению сервис, позволяющий в одно касание получить основную информацию
          об интересных исторических местах и социально значимых объектах,
          расположенных в шаговой доступности от текущего местоположения
          пользователя.
          <br />
          Платформа разработана для социально ориентированных некоммерческих
          организаций, реализующих грантовые проекты в сфере социального туризма
          для людей с инвалидностью по зрению.
        </p>
        <div>
          <h4>
            <ContactsIcon /> Контакты
          </h4>
          Пожелания, предложения и сообщения об ошибках Вы можете отправить
          сюда. Спасибо!
          <ListGroup>
            <ListGroup.Item>
              <a
                className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
                href="tg://resolve?domain=elliottmiragewitt"
              >
                <TgIcon /> @elliottmiragewitt
              </a>
            </ListGroup.Item>
            <ListGroup.Item>
              <a
                className="text-decoration-none"
                href="mailto:lavrent0@yandex.ru"
              >
                <EmailIcon /> lavrent0@yandex.ru
              </a>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </div>
      <footer className="text-muted mt-3">
        Версия приложения: {__APP_VERSION__} (от{" "}
        {dayjs(import.meta.env.VITE_LAST_COMMIT_DATE).format("LLL")})
        <br />
        {health && (
          <>
            Версия API: {health.version} (от{" "}
            {dayjs(health.lastCommitDate).format("LLL")})
          </>
        )}
      </footer>
    </Container>
  );
};

export default About;
