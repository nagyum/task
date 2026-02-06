import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import style from "./AuthInput.module.scss";

interface AuthInputProps extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ type, placeholder, error, ...rest }, ref) => {
    const isPasswordField = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPasswordField && showPassword ? "text" : type;

    return (
      <div className={style.authInput}>
        <input
          ref={ref}
          type={resolvedType}
          placeholder={placeholder}
          className={isPasswordField ? style.withToggle : undefined}
          {...rest}
          autoComplete="off"
        />
        {isPasswordField && (
          <button
            type="button"
            className={style.toggleButton}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "숨김" : "보기"}
          </button>
        )}
        {error && <p>{error}</p>}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
