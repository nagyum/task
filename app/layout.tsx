import { cookies } from "next/headers";
import type { ReactNode } from "react";
import Header from "./Header";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const loggedIn = cookieStore.has("accessToken");
  return (
    <html lang="ko">
      <body>
        <Header loggedIn={loggedIn} />
        {children}
      </body>
    </html>
  );
}
