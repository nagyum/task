"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { clearAuthTokens } from "@/src/api/client";
import { isLoggedIn } from "@/src/utils/auth";
import { getUser } from "@/src/utils/users";
import style from "./Header.module.scss";

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearAuthTokens();
    setOpen(false);
    setLoggedIn(false);
    setUser(null);
    router.refresh();
  };
  const showAuth = mounted && loggedIn;

  return (
    <header className={style.header}>
      <div className={style.wrap}>
        <Link href="/" className={style.logo} aria-label="BIGS 홈">
          <Image
            src="/header-logo.svg"
            alt="BIGS"
            width={96}
            height={28}
            priority
          />
        </Link>

        <nav className={style.nav} aria-label="메인 메뉴">
          {!showAuth ? (
            <Link className={style.navLink} href="/signin">
              로그인
            </Link>
          ) : (
            <>
              <span className={style.userInfo}>
                {user?.name} ({user?.username})
              </span>
              <Link className={style.navLink} href="/board">
                커뮤니티
              </Link>
              <button
                type="button"
                className={style.logoutButton}
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          className={style.menuButton}
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
        >
          <span className={style.menuIcon} />
        </button>
      </div>

      {open && (
        <div className={style.mobileLayer}>
          <button
            type="button"
            className={style.overlay}
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          />
          <aside
            className={style.sidebar}
            role="dialog"
            aria-label="모바일 메뉴"
          >
            <div className={style.sidebarHeader}>
              <Link
                href="/"
                className={style.sidebarLogo}
                onClick={() => setOpen(false)}
                aria-label="BIGS 홈"
              >
                <Image
                  src="/header-logo.svg"
                  alt="BIGS"
                  width={96}
                  height={28}
                  priority
                />
              </Link>
              <button
                type="button"
                className={style.closeButton}
                aria-label="닫기"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className={style.sidebarNav} aria-label="모바일 메뉴 항목">
              {!showAuth ? (
                <Link
                  className={style.sidebarLink}
                  href="/signin"
                  onClick={() => setOpen(false)}
                >
                  로그인
                </Link>
              ) : (
                <>
                  <div className={style.sidebarUser}>
                    {user?.name} ({user?.username})
                  </div>
                  <Link
                    className={style.sidebarLink}
                    href="/board"
                    onClick={() => setOpen(false)}
                  >
                    커뮤니티
                  </Link>
                  <button
                    type="button"
                    className={style.sidebarButton}
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </>
              )}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
};

export default Header;
