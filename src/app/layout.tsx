import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAGloma",
  description: "RAGloma is a RAG application with different modes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <ThemeProvider
          defaultTheme='system'
          attribute='class'
          disableTransitionOnChange
          enableSystem
        >
          <Navbar />
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
