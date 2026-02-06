import style from "./BoardDetailSkeleton.module.scss";

export default function BoardDetailSkeleton() {
  return (
    <section className={style.container} aria-busy="true">
      <header className={style.header}>
        <div className={style.category} />
        <div className={style.title} />
        <div className={style.date} />
      </header>

      <div className={style.content}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={style.line} />
        ))}
      </div>

      <footer className={style.footer}>
        <div className={style.backButton} />
        <div className={style.actions}>
          <div className={style.actionButton} />
          <div className={style.actionButton} />
        </div>
      </footer>
    </section>
  );
}
