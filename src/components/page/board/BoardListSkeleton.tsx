import style from "./BoardListSkeleton.module.scss";

type Props = {
  rows?: number;
};

export default function BoardListSkeleton({ rows = 8 }: Props) {
  return (
    <section className={style.container} aria-busy="true">
      <header className={style.header}>
        <div className={style.title} />
        <div className={style.button} />
      </header>

      <ul className={style.list}>
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className={style.item}>
            <div className={style.category} />
            <div className={style.titleLine} />
            <div className={style.date} />
          </li>
        ))}
      </ul>

      <div className={style.pagination}>
        <div className={style.pageButton} />
        <div className={style.pageInfo} />
        <div className={style.pageButton} />
      </div>
    </section>
  );
}
