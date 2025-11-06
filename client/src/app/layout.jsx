import { Space_Mono } from "next/font/google";
import "./globals.css";


const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Alrdich.Ai",
  description: "Endless AI-powered text adventures.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.className}`}
      >
        <main className="flex min-h-screen items-center justify-center bg-[#2b2d42] text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
