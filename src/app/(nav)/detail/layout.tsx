import BackNav from "@/components/nav/backNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ padding: "1rem" }}>
      <BackNav text="예약 내역" />
      {children}
    </div>
  );
}
