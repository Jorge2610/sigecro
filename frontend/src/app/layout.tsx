import type { Metadata } from "next";
import "@/styles/globals.css";
import "material-symbols/outlined.css";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { Toaster } from "@/components/ui/toaster";
import SigBread from "@/components/navigation/SigBread";

export const metadata: Metadata = {
    title: "SIGECRO",
    description: "Sistema Gestor de Cronologías",
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="es">
            <head>
                <link rel="icon" href="/logo.webp" sizes="any" />
            </head>
            <body className="relative flex flex-col max-w-[100svw] min-h-[100svh] font-montserrat text-sig-text">
                <Navigation />
                <div className="grow pb-14 pt-4 px-[5%] md:px-[10%] bg-sig-gray1">
                    <SigBread />
                    {children}
                </div>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
