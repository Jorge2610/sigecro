import type { Metadata } from "next";
import "@/styles/globals.css";
import 'material-symbols/outlined.css';
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";

export const metadata: Metadata = {
  title: "SIGECRO",
  description: "Sistema Gestor de Cronologías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" >
      <head>
        <link rel="icon" href="/logo.webp" sizes="any" />
      </head>
      <body className="flex-col relative w-[100svw] min-h-[100svh] font-montserrat">
        <Navigation />
        <div className="min-h-[calc(100svh-100px)] md:min-h-[calc(100svh-60px)] pb-14 pt-4 px-[5%] md:px-[10%] bg-sig-gray1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}