import { Inter } from "next/font/google";
import "../styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry Management App",
  description: "An app to manage your pantry inventory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
