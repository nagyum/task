import Link from "next/link";

const Header = ({ loggedIn }: { loggedIn: boolean }) => {
  return (
    <header>
      <Link href="/">BIGS</Link>
      <nav>
        {!loggedIn ? (
          <Link href="/signin">로그인</Link>
        ) : (
          <>
            <Link href="/board">커뮤니티</Link>
            <form action="/auth/logout" method="post">
              <button>로그아웃</button>
            </form>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
