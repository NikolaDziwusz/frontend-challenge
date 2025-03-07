import type { Metadata } from "next";
import { PhotoProvider } from "@/context/PhotoContext";
import "./globals.css";
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: "Photo Gallery App",
    description: "Capture and view photos with a gallery",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <PhotoProvider>
            {children}
        </PhotoProvider>
        </body>
        </html>
    );
}
