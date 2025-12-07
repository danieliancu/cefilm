import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

const cinzel = Cinzel({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap"
});

export const metadata: Metadata = {
  title: "CEFILM? - AI Cinema Adviser",
  description:
    "O experiență cinematografică personalizată. Răspunde la un quiz despre starea ta, iar AI-ul îți va recomanda filmul perfect analizând psihologia ta."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${montserrat.variable} ${cinzel.variable}`}>
      <body className="font-sans bg-[#050505] text-[#e5e5e5]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
