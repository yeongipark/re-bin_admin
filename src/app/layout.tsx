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
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
