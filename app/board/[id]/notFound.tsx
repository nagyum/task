import Link from "next/link";

export default function BoardNotFound() {
  return (
    <div
      style={{
        maxWidth: 500,
        margin: "100px auto",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>존재하지 않는 글입니다</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        삭제되었거나 잘못된 주소입니다.
      </p>
      <Link
        href="/board"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#0963ec",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}
