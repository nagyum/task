"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import style from "./SignIn.module.scss";
import AuthInput from "../../Layout/AuthInput/AuthInput";
import signinSchema, { SigninFormValues } from "@/src/schema/signinSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "@/src/api/authApi";

const SignInForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("signin form values:", data);
    setSubmitError(null);

    try {
      await signin({
        username: data.username,
        password: data.password,
      });

      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setSubmitError(message);
    }
  });

  return (
    <form className={style.form} onSubmit={onSubmit}>
      <div className={style.flexBox}>
        <AuthInput
          type="text"
          placeholder="이메일(username)을 입력해주세요"
          error={errors.username?.message}
          {...register("username")}
        />

        <div>
          <AuthInput
            type="password"
            placeholder="비밀번호를 입력하세요"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
      </div>

      {submitError && <p className={style.submitError}>{submitError}</p>}

      <button type="submit" className={style.submit} disabled={isSubmitting}>
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
};

export default SignInForm;
