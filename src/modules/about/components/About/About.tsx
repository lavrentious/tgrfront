import * as React from "react";
import { Alert, Container, Image, ListGroup } from "react-bootstrap";
import {
  BsEnvelopeAtFill as EmailIcon,
  BsGearFill as TechInfoIcon,
  BsPersonLinesFill as ContactsIcon,
  BsTelegram as TgIcon,
} from "react-icons/bs";
import TgLogo from "src/assets/tg_logo.png";

const About: React.FunctionComponent = () => {
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
                href="tg://resolve?domain=lavrentious"
              >
                <TgIcon /> @lavrentious
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
        <div>
          <h4>
            <TechInfoIcon /> Техническая информация
          </h4>
          <p>
            Это обновлённая версия веб-сервиса. Все данные и основная логика
            работы сохранены.
          </p>
          <Alert variant="warning">
            Из соображений безопасности и производительности в этой версии
            используется новый алгоритм хеширования паролей, не совместимый с
            предыдущим. Это означает, что старые пароли не работают и требуют
            обновления.
            <br />
            <strong>
              Для работы Вам необходимо однократно сбросить пароль, используя
              кнопку на <a href="/login">странице входа</a>.
            </strong>
            <br />
            Приносим извинения за доставленные неудобства.
          </Alert>
          <Alert variant="warning">
            Функция верификации аккаунтов находится в разработке и будет
            внедрена в ближайшее время. Для изменения прав пользователей,
            пожалуйста, обратитесь по ссылкам выше.
          </Alert>
        </div>
      </div>
    </Container>
  );
};

export default About;
