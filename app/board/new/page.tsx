import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import BoardForm from "@/src/components/page/board/BoardForm";
import { getBoardCategories } from "@/src/api/boardApi";

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default async function NewBoardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/signin");
  }

  const tokens = { accessToken, refreshToken };

  let categories;

  try {
    categories = await getBoardCategories(tokens);
  } catch (err) {
    const status = getErrorStatus(err);

    if (status === 401 || status === 403) {
      redirect("/signin");
    }

    throw err;
  }

  return <BoardForm mode="create" categories={categories} />;
}
