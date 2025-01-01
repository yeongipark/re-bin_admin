import NoticeDetail from "@/components/notice.detail/noticeDetail";

export default function Page({ params }: { params: { id: number | string } }) {
  return <NoticeDetail />;
}
