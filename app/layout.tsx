import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/public/providers/AuthProvider";
import Script from "next/script";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { getUser } from "@/server/users/users.service";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Stack Pro – AI, Technology & IT Solutions",
  keywords: [
    "AI",
    "Artificial Intelligence",
    "Technology innovations",
    "IT solutions",
    // "Blockchain",
    // "Crypto",
    "Machine Learning",
    "Web development",
    "Frontend development",
    "Backend development",
    "Next.js",
    "Flutter",
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
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devstackpro.cloud/",
    title: "Dev Stack Pro – Blog on AI, Technology & IT Solutions",
    description:
      "Stay updated on the latest technology innovations, AI, Machine Learning, Blockchain, and modern IT solutions. Expert guides, analysis, and in-depth knowledge for developers and businesses.",
    siteName: "Dev Stack Pro",
    images: [
      {
        url: "https://devstackpro.cloud/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dev Stack Pro – AI & Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Stack Pro – AI & Technology",
    description:
      "Explore trends in AI, technology innovations, and IT solutions for developers and businesses.",
    images: ["https://devstackpro.cloud/images/og-image.png"],
    creator: "@elonmusk",
  },
  alternates: {
    canonical: "https://devstackpro.cloud/",
  },
  category: "technology",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-TMJEF9T77H"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TMJEF9T77H');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider initialProfile={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
