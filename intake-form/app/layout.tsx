import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadCatch AI — Tell us about your business",
  description: "Finish your LeadCatch AI setup by sharing a few details about your business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-full">{children}</div>
      </body>
    </html>
  );
}
