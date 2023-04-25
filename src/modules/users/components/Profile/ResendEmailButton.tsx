import { default as React, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { ApiError } from "src/modules/common/api";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import useFetch from "src/modules/common/hooks/useFetch";
import { RootState } from "src/store";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";

interface ResendEmailButtonProps {
  user: User;
  setUser: (user: User) => void;
}

const ResendEmailButton: React.FC<ResendEmailButtonProps> = React.memo(
  function ResendEmailButton({ user, setUser }: ResendEmailButtonProps) {
    const loggedUser = useSelector((state: RootState) => state.auth.user);
    const [isShown, setIsShown] = useState<boolean>(true);
    const { fetch, isFetching } = useFetch(() =>
      UserService.resendEmail()
        .then(() => {
          toast.success(
            `Письмо с подтверждением отправлено на почту ${user.email}`
          );
          setIsShown(false);
        })
        .catch((e: ApiError) => {
          if (e?.response?.status === 400) {
            setUser({ ...user, emailConfirmed: true });
          }
        })
    );
    return (
      <>
        {isShown && user._id === loggedUser?.id && !user.emailConfirmed && (
          <LoadingButton
            className="mx-1"
            isLoading={isFetching}
            onClick={fetch}
            size="sm"
          >
            Отправить подтверждение
          </LoadingButton>
        )}
      </>
    );
  }
);

export default ResendEmailButton;
