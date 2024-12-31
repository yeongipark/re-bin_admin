import LoginNav from "@/components/nav/loginNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LoginNav />
      {children}
    </>
  );
}
