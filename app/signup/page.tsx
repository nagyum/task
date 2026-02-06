import SignUpForm from "@/src/components/page/signup/SignUpForm";
import Link from "next/link";
import style from "./page.module.scss";

export default function SignupPage() {
  return (
    <div className={style.container}>
      <h1>회원가입</h1>
      <SignUpForm />
      <p className={style.description}>
        이미 계정이 있으신가요?{" "}
        <Link href="/signin" className={style.text}>
          로그인
        </Link>
      </p>
    </div>
  );
}
