"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signup } from "@/src/api/authApi";
import signupSchema, { SignupFormValues } from "@/src/schema/signupSchema";

import style from "./SignUp.module.scss";
import AuthInput from "../../Layout/AuthInput/AuthInput";

const SignUpForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);

    try {
      await signup({
        username: data.username,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      router.push("/signin");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setSubmitError(message);
    }
  });

  return (
    <form className={style.form} onSubmit={onSubmit}>
      <div className={style.flexBox}>
        <AuthInput
          type="text"
          placeholder="이름을 입력해주세요"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthInput
          type="text"
          placeholder="이메일(username)을 입력해주세요"
          error={errors.username?.message}
          {...register("username")}
        />

        <AuthInput
          type="password"
          placeholder="비밀번호를 입력하세요"
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthInput
          type="password"
          placeholder="동일한 비밀번호를 입력해주세요"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      {submitError && <p className={style.submitError}>{submitError}</p>}

      <button type="submit" className={style.submit} disabled={isSubmitting}>
        {isSubmitting ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
};

export default SignUpForm;
