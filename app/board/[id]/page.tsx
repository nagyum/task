import { redirect } from "next/navigation";
import BoardDetailClient from "@/src/components/page/board/BoardDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const boardId = Number(id);

  if (Number.isNaN(boardId)) {
    redirect("/board");
  }

  return <BoardDetailClient id={boardId} />;
}
