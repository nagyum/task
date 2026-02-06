import { redirect } from "next/navigation";
import EditBoardClient from "@/src/components/page/board/EditBoardClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBoardPage({ params }: Props) {
  const { id } = await params;
  const boardId = Number(id);

  if (Number.isNaN(boardId)) {
    redirect("/board");
  }

  return <EditBoardClient id={boardId} />;
}
