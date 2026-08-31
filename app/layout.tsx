import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REFORM | Service Prototype",
  description: "모바일 앱 서비스 기획 시연을 위한 프로토타입 워크스페이스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
