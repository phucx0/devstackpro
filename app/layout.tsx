import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/public/providers/UserProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI/UX Design & Development Resources | CSS, Flutter, Next.js",
  description: "Comprehensive guide and resources for modern UI/UX design, CSS frameworks, responsive web design, mobile app development with Flutter, and Next.js best practices. Learn to build beautiful, performant applications.",
  keywords: [
    "UI design",
    "UX design",
    "CSS tutorials",
    "responsive design",
    "Flutter development",
    "Next.js framework",
    "mobile app design",
    "web development",
    "frontend development",
    "UI components"
  ],
  authors: [{ name: "Dev Stack Pro" }],
  creator: "Dev Stack Pro",
  publisher: "Dev Stack Pro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://dev-stack-pro.vercel.app/",
    title: "UI/UX Design & Development Resources",
    description: "Master modern web and mobile development with expert guides on CSS, Flutter, Next.js, and UI design principles",
    siteName: "Dev Stack Pro",
    images: [
      {
        url: "https://dev-stack-pro.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "UI/UX Design Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design & Development Resources",
    description: "Learn CSS, Flutter, Next.js and modern UI design",
    images: ["https://dev-stack-pro.vercel.app/images/og-image.png"],
    creator: "@elonmusk",
  },
  alternates: {
    canonical: "https://dev-stack-pro.vercel.app/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
