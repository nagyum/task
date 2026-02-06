import Link from "next/link";
import style from "./page.module.scss";

export default function Page() {
  return (
    <main className={style.page}>
      <section className={style.hero}>
        <p className={style.kicker}>BIGS PAYMENTS ASSIGNMENT</p>
        <h1 className={style.title}>간단한 커뮤니티 게시판</h1>
        <p className={style.subtitle}>
          로그인 후 글을 확인하고, 새 글을 작성해보세요.
        </p>
        <div className={style.ctaRow}>
          <Link className={style.primaryCta} href="/board">
            커뮤니티로 이동
          </Link>
          <Link className={style.secondaryCta} href="/signin">
            로그인
          </Link>
        </div>
      </section>
    </main>
  );
}
