import BackNav from "@/components/nav/backNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ padding: "0.6rem" }}>
      <BackNav text="소개글 수정" />
      {children}
    </div>
  );
}
