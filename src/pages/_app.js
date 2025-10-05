import "@/styles/globals.css";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/station.scss";
import { Toaster } from "react-hot-toast";
import { ReownProvider } from "@/config/reown";

const figtree = Figtree({
  weights: [400, 700],
  subsets: ["latin"],
  variable: "--font-figtree",
});

const gt_walsheim = localFont({
  src: "./GT-Walsheim.otf",
  variable: "--font-gt-walsheim",
  weights: [500],
});

export default function App({ Component, pageProps }) {
  return (
    <ReownProvider>
    <main className={`${figtree.variable} ${gt_walsheim.variable}`}>
      <Toaster />
      <Component {...pageProps} />
    </main>
    </ReownProvider>
  );
}
