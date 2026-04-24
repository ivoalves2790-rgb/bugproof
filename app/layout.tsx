import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
  ),
  title: {
    default: "Bugproof — Learn Software Engineering",
    template: "%s | Bugproof",
  },
  description:
    "Interactive software engineering lessons. Learn git, debugging, security, architecture, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bugproof",
  },
  openGraph: {
    type: "website",
    siteName: "Bugproof",
    title: "Bugproof — Learn Software Engineering",
    description:
      "You build with AI. Now learn the engineering behind it. Interactive lessons in git, debugging, security, architecture, and more.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Bugproof mascot" }],
  },
  twitter: {
    card: "summary",
    title: "Bugproof — Learn Software Engineering",
    description: "Interactive software engineering lessons for AI-assisted developers.",
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#00ff41",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full overflow-x-hidden`}>
      <body className="min-h-full w-full max-w-[100vw] overflow-x-hidden bg-background text-foreground font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
