import Link from "next/link";
import style from "./notFound.module.scss";

export default function BoardNotFound() {
  return (
    <div className={style.content}>
      <h1 className={style.title}>존재하지 않는 글입니다</h1>
      <p className={style.text}>삭제되었거나 잘못된 주소입니다.</p>
      <Link href="/board" className={style.link}>
        목록으로 돌아가기
      </Link>
    </div>
  );
}
