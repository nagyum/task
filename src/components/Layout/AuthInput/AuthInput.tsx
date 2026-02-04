import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";
import style from "./AuthInput.module.scss";

interface AuthInputProps extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ type, placeholder, error, ...rest }, ref) => {
    return (
      <div className={style.authInput}>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...rest}
          autoComplete="off"
        />
        {error && <p>{error}</p>}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
