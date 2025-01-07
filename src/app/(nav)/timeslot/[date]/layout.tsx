import BackNav from "@/components/nav/backNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ padding: "0.6rem" }}>
      <BackNav text="" />
      {children}
    </div>
  );
}
