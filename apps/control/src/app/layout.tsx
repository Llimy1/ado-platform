import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADO Control Room",
  description: "ADO 오케스트레이션 운영 콘솔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
