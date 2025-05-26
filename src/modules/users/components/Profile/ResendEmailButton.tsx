import { default as React, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { useAppDispatch, type RootState } from "src/store";
import {
  useResendConfirmationEmailMutation,
  usersApi,
} from "../../api/users.api";
import { User } from "../../models/user.model";

interface ResendEmailButtonProps {
  user: User;
}

const ResendEmailButton: React.FC<ResendEmailButtonProps> = React.memo(
  function ResendEmailButton({ user }: ResendEmailButtonProps) {
    const dispatch = useAppDispatch();

    const loggedUser = useSelector((state: RootState) => state.auth.user);
    const [isShown, setIsShown] = useState<boolean>(true);
    const [resend, { isLoading }] = useResendConfirmationEmailMutation();
    const fetch = useCallback(() => {
      resend()
        .unwrap()
        .then(() => {
          toast.success(
            `Письмо с подтверждением отправлено на почту ${user.email}`,
          );
          setIsShown(false);
        })
        .catch((e) => {
          toast.error(formatApiError(e));
          dispatch(
            usersApi.util.invalidateTags([{ type: "User", id: user._id }]),
          );
        });
    }, [dispatch, resend, user._id, user.email]);
    return (
      <>
        {isShown && user._id === loggedUser?.id && !user.emailConfirmed && (
          <LoadingButton
            className="mx-1"
            isLoading={isLoading}
            onClick={() => fetch()}
            size="sm"
          >
            Отправить подтверждение
          </LoadingButton>
        )}
      </>
    );
  },
);

export default ResendEmailButton;
