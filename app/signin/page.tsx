import SignInForm from "@/src/components/page/signin/SignInForm";
import style from "./page.module.scss";

export default function SigninPage() {
  return (
    <div className={style.div}>
      <h1>로그인</h1>
      <SignInForm />
    </div>
  );
}
