import SignInForm from "@/src/components/page/signin/SignInForm";
import style from "./page.module.scss";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className={style.container}>
      <h1>로그인</h1>
      <SignInForm />
      <p className={style.description}>
        계정이 없으신가요?{" "}
        <Link href="/signup" className={style.text}>
          회원가입
        </Link>
      </p>
    </div>
  );
}
