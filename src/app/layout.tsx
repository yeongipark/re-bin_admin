import Nav from "@/components/nav/nav";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          maxWidth: "600px",
          margin: "auto",
          padding: "1rem",
          minHeight: "100vh",
        }}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
