import BackNav from "@/components/nav/backNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ padding: "0.6rem" }}>
      <BackNav text="변경할 아이디를 입력해 주세요." />
      {children}
    </div>
  );
}
